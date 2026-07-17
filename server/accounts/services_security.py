import bcrypt
import hashlib
import hmac
from datetime import timedelta
from uuid import UUID
from django.conf import settings
from django.utils import timezone
from jose import ExpiredSignatureError, JWTError, jwt
from rest_framework.exceptions import AuthenticationFailed
from .constants import TokenType


class SecurityService:
    """
    Handles all cryptographic operations for the accounts domain:
    - bcrypt password hashing & verification
    - HMAC-SHA256 refresh token hashing & verification
    - JWT issuance and signature validation (with separate access/refresh secrets)
    """

    @staticmethod
    def hash_secret(secret: str) -> str:
        """Securely hashes a plain-text password or secret using bcrypt."""
        # Bcrypt has a strict 72-byte limit; we truncate to prevent ValueError
        return bcrypt.hashpw(secret[:72].encode("utf-8"), bcrypt.gensalt()).decode(
            "utf-8"
        )

    @staticmethod
    def verify_secret(plain_secret: str, hashed_secret: str) -> bool:
        """Verifies a plain-text secret against a stored bcrypt hash."""
        # Bcrypt has a strict 72-byte limit; we truncate to prevent ValueError
        return bcrypt.checkpw(
            plain_secret[:72].encode("utf-8"), hashed_secret.encode("utf-8")
        )

    @staticmethod
    def hash_token(token: str) -> str:
        """
        Fast HMAC-SHA256 hashing for refresh tokens before database storage.
        Uses JWT_REFRESH_SECRET as the HMAC key to protect against DB dumps.
        """
        return hmac.new(
            settings.JWT_REFRESH_SECRET.encode("utf-8"),
            token.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

    @staticmethod
    def verify_token(plain_token: str, hashed_token: str) -> bool:
        """
        Constant-time comparison of a plain refresh token against its stored HMAC hash.
        Prevents timing attacks during token verification.
        """
        return hmac.compare_digest(
            SecurityService.hash_token(plain_token), hashed_token
        )

    @staticmethod
    def _create_jwt(
        subject: UUID, session_id: UUID, token_type: TokenType, expires_delta: timedelta
    ) -> str:
        """Internal helper to assemble standard claims and sign the JWT."""
        # Dynamically pick the corresponding secret key based on token type
        secret = (
            settings.JWT_REFRESH_SECRET
            if token_type == TokenType.REFRESH
            else settings.JWT_ACCESS_SECRET
        )

        # Evaluate timezone.now() once to prevent millisecond drift between iat and exp
        now = timezone.now()
        expires_at = now + expires_delta

        payload = {
            "sub": str(subject),  # RFC 7519: Subject (User ID)
            "sid": str(session_id),  # OIDC: Session ID
            "type": str(token_type),  # Security: Prevents access/refresh confusion
            "iat": int(now.timestamp()),  # RFC 7519: Issued At (Unix Integer)
            "exp": int(
                expires_at.timestamp()
            ),  # RFC 7519: Expiration Time (Unix Integer)
        }
        return jwt.encode(payload, secret, algorithm="HS256")

    @classmethod
    def generate_access_token(cls, user_id: UUID, session_id: UUID) -> str:
        """Generates a short-lived access token signed with JWT_ACCESS_SECRET."""
        access_minutes = getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 15)
        return cls._create_jwt(
            subject=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
            expires_delta=timedelta(minutes=access_minutes),
        )

    @classmethod
    def generate_refresh_token(cls, user_id: UUID, session_id: UUID) -> str:
        """Generates a long-lived refresh token signed with JWT_REFRESH_SECRET."""
        expire_days = getattr(settings, "REFRESH_TOKEN_EXPIRE_DAYS", 7)
        return cls._create_jwt(
            subject=user_id,
            session_id=session_id,
            token_type=TokenType.REFRESH,
            expires_delta=timedelta(days=expire_days),
        )

    @staticmethod
    def verify_jwt(token: str, expected_type: TokenType = TokenType.ACCESS) -> dict:
        """
        Decodes and validates a JWT signature against the corresponding secret key.
        Raises DRF AuthenticationFailed exceptions that automatically convert to HTTP 401s.
        """
        # Pick the exact secret key used to sign this specific token type
        secret = (
            settings.JWT_REFRESH_SECRET
            if expected_type == TokenType.REFRESH
            else settings.JWT_ACCESS_SECRET
        )
        try:
            payload = jwt.decode(token, secret, algorithms=["HS256"])

            # Prevent token confusion: ensure an access token wasn't passed to a refresh endpoint
            if expected_type and payload.get("type") != str(expected_type):
                raise AuthenticationFailed("Invalid token type")

            return payload

        except ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except JWTError:
            raise AuthenticationFailed("Invalid or malformed token")
