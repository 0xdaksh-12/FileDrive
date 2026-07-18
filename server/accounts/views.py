from rest_framework import views, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, TokenResponseSerializer
from rest_framework.permissions import AllowAny
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
