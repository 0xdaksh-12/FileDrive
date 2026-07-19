from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from accounts.constants import (
    ERROR_INVALID_SESSION,
    ERROR_USER_INVALID,
    TokenType,
)
from accounts.services_security import SecurityService
from .models import AuthSession, User


class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]
        
        # Verify the access token using SecurityService
        payload = SecurityService.verify_jwt(token, expected_type=TokenType.ACCESS)

        user = User.objects.filter(id=payload["sub"], is_active=True).first()
        if not user:
            raise AuthenticationFailed(ERROR_USER_INVALID)

        session = AuthSession.objects.filter(id=payload["sid"], valid=True).first()
        if not session:
            raise AuthenticationFailed(ERROR_INVALID_SESSION)

        # Returns (request.user, request.auth)
        return (user, payload["sid"])

    def authenticate_header(self, request):
        return "Bearer"
