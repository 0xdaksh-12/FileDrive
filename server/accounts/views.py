from rest_framework import status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .constants import REFRESH_TOKEN_COOKIE
from .serializers import LoginSerializer, RegisterSerializer, TokenResponseSerializer
from .services_auth import AuthService


class RegisterView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        access, refresh = AuthService.register(
            **serializer.validated_data, request=request
        )

        response = Response(
            TokenResponseSerializer({"access_token": access}).data,
            status=status.HTTP_201_CREATED,
        )

        AuthService.set_cookie_token(response, refresh)
        return response


class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        access, refresh = AuthService.login(
            **serializer.validated_data, request=request
        )

        response = Response(
            TokenResponseSerializer({"access_token": access}).data,
            status=status.HTTP_200_OK,
        )
        AuthService.set_cookie_token(response, refresh)
        return response


class RefreshView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.COOKIES.get(REFRESH_TOKEN_COOKIE)
        if not token:
            return Response(status=status.HTTP_204_NO_CONTENT)

        try:
            access, refresh = AuthService.refresh(token)
            response = Response(TokenResponseSerializer({"access_token": access}).data)
            if refresh:
                AuthService.set_cookie_token(response, refresh)
            return response
        except Exception:
            response = Response(status=status.HTTP_204_NO_CONTENT)
            AuthService.delete_cookie_token(response)
            return response


class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # request.auth holds our session_id from CustomJWTAuthentication
        AuthService.logout(session_id=request.auth)

        # TODO: Later update the last_login from User model

        response = Response(status=status.HTTP_204_NO_CONTENT)
        AuthService.delete_cookie_token(response)
        return response
