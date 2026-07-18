from datetime import timedelta
from uuid import UUID
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from .models import AuthIdentity, AuthSession, User
from .services_security import SecurityService
from django.conf import settings
from rest_framework.response import Response


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
            raise ValidationError({"detail": "User with this email already exists"})

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
            # print(e)
            raise

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
    def set_cookie_token(response: Response, token: str) -> None:
        """Attach HttpOnly refresh token cookie to DRF Response."""
        is_prod = getattr(settings, "DEBUG", True) is False
        expire_days = getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 7)

        response.set_cookie(
            key="refresh_token",
            value=token,
            httponly=True,
            samesite="None" if is_prod else "Lax",
            secure=is_prod,
            path="/api/auth",  # Restrict cookie strictly to auth routes!
            max_age=expire_days * 24 * 60 * 60,
        )
