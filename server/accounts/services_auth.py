from datetime import timedelta
from uuid import UUID

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response

from accounts.constants import (
    ERROR_EMAIL_ALREADY_EXISTS,
    ERROR_INVALID_CREDENTIALS,
    ERROR_INVALID_SESSION,
    ERROR_USER_INVALID,
    REFRESH_TOKEN_COOKIE,
    TokenType,
)
from accounts.models import AuthIdentity, AuthSession, User
from accounts.services_security import SecurityService


class AuthService:
    """Manages user registration, authentication, and session lifecycle in Django."""

    @classmethod
    @transaction.atomic
    def register(
        cls, name: str, email: str, password: str, request=None
    ) -> tuple[str, str]:
        """Register a new user, create their local identity, and issue initial session tokens."""
        if AuthIdentity.objects.filter(
            provider=AuthIdentity.Provider.EMAIL, email=email
        ).exists():
            raise ValidationError({"detail": ERROR_EMAIL_ALREADY_EXISTS})

        try:
            # Create core profile and local email identity
            user = User.objects.create_user(email=email, name=name)
            AuthIdentity.objects.create(
                user=user,
                provider=AuthIdentity.Provider.EMAIL,
                email=email,
                password_hash=SecurityService.hash_secret(password),
            )

            # Create Sessions & Tokens
            session = cls._create_session(user, request)
            access, refresh = cls._generate_token_pair(user.id, session.id)

            # Store hashed refresh token
            session.refresh_token_hash = SecurityService.hash_token(refresh)
            session.save(update_fields=["refresh_token_hash"])

            return access, refresh

        except Exception:
            raise

    @classmethod
    @transaction.atomic
    def login(cls, email: str, password: str, request=None) -> tuple[str, str]:
        """Authenticate existing user and create a new session."""
        identity = AuthIdentity.objects.filter(
            provider=AuthIdentity.Provider.EMAIL, email=email
        ).first()

        if (
            not identity
            or not identity.password_hash
            or not SecurityService.verify_secret(password, identity.password_hash)
        ):
            raise AuthenticationFailed(ERROR_INVALID_CREDENTIALS)

        user = identity.user
        if not user.is_active:
            raise AuthenticationFailed(ERROR_USER_INVALID)

        session = cls._create_session(user, request)
        access, refresh = cls._generate_token_pair(user.id, session.id)

        session.refresh_token_hash = SecurityService.hash_token(refresh)
        session.save(update_fields=["refresh_token_hash"])

        return access, refresh

    @classmethod
    @transaction.atomic
    def refresh(cls, token: str) -> tuple[str | None, str | None]:
        """Rotate refresh token (if >75% expired) and issue a new access token."""
        payload = SecurityService.verify_jwt(token, expected_type=TokenType.REFRESH)

        user_id = UUID(payload["sub"])
        session_id = UUID(payload["sid"])

        session = AuthSession.objects.filter(id=session_id, valid=True).first()
        if not session or (session.expires_at and session.expires_at < timezone.now()):
            raise AuthenticationFailed(ERROR_INVALID_SESSION)

        # Verify token against stored hash
        if not session.refresh_token_hash or not SecurityService.verify_token(
            token, session.refresh_token_hash
        ):
            session.valid = False
            session.save(update_fields=["valid", "updated_at"])
            return None, None

        # Always generate a new short-lived access token
        access_token = SecurityService.generate_access_token(user_id, session_id)

        # Check if refresh token has used >= 75% of its lifetime
        new_refresh_token = None

        if cls._should_rotate_refresh_token(payload):
            new_refresh_token = SecurityService.generate_refresh_token(
                user_id, session_id
            )
            session.refresh_token_hash = SecurityService.hash_token(new_refresh_token)

            # Extend session expiry in DB
            expire_days = getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 7)
            session.expires_at = timezone.now() + timedelta(days=expire_days)
            session.save(
                update_fields=["refresh_token_hash", "expires_at", "updated_at"]
            )

        return access_token, new_refresh_token

    @classmethod
    def logout(cls, session_id: str | UUID):
        """Invalidate the current session."""
        AuthSession.objects.filter(id=session_id, valid=True).update(
            valid=False, refresh_token_hash=None
        )

    @classmethod
    def logout_all(cls, user_id: str | UUID):
        """Invalidate all active sessions for a user."""
        AuthSession.objects.filter(user_id=user_id, valid=True).update(
            valid=False, refresh_token_hash=None
        )

    @classmethod
    def _create_session(cls, user: User, request=None) -> AuthSession:
        """Create a new user session record with IP and User-Agent metadata."""
        expire_days = getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 7)

        ip_address = None
        user_agent = None

        if request:
            # Extract client IP: try X-Forwarded-For, then X-Real-IP, then REMOTE_ADDR
            x_forwarded_for = request.headers.get("X-Forwarded-For")
            if x_forwarded_for:
                ip_address = x_forwarded_for.split(",")[0].strip()
            else:
                ip_address = request.headers.get("X-Real-IP") or request.META.get(
                    "REMOTE_ADDR"
                )

            # Extract and truncate User-Agent
            user_agent = request.headers.get("User-Agent", "")[:512]

        return AuthSession.objects.create(
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=timezone.now() + timedelta(days=expire_days),
        )

    @classmethod
    def _generate_token_pair(cls, user_id: UUID, session_id: UUID) -> tuple[str, str]:
        """Generate both access and refresh tokens."""
        access_token = SecurityService.generate_access_token(user_id, session_id)
        refresh_token = SecurityService.generate_refresh_token(user_id, session_id)
        return access_token, refresh_token

    @staticmethod
    def _should_rotate_refresh_token(payload: dict) -> bool:
        """Return True if refresh token has used >= 75% of its lifetime."""
        iat = payload["iat"]
        exp = payload["exp"]
        lifetime = exp - iat
        elapsed = timezone.now().timestamp() - iat
        return elapsed >= (lifetime * 0.75)

    @staticmethod
    def set_cookie_token(response: Response, token: str) -> None:
        """Attach HttpOnly refresh token cookie to DRF Response."""
        is_prod = getattr(settings, "DEBUG", True) is False
        expire_days = getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 7)

        response.set_cookie(
            key=REFRESH_TOKEN_COOKIE,
            value=token,
            httponly=True,
            samesite="None" if is_prod else "Lax",
            secure=is_prod,
            path="/api/auth",  # Restrict cookie strictly to auth routes!
            max_age=expire_days * 24 * 60 * 60,
        )

    @staticmethod
    def delete_cookie_token(response: Response) -> None:
        """Clear HttpOnly refresh token cookie."""
        is_prod = getattr(settings, "DEBUG", True) is False
        response.delete_cookie(
            key=REFRESH_TOKEN_COOKIE,
            path="/api/auth",
            samesite="None" if is_prod else "Lax",
        )
