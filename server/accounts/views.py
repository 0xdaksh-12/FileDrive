from rest_framework import views, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, TokenResponseSerializer
from rest_framework.permissions import AllowAny
from .services import AuthService


class RegisterView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Tells Pyright: this is definitively a dictionary!
        assert isinstance(serializer.validated_data, dict)

        access, refresh = AuthService.register(
            name=serializer.validated_data["name"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            request=request,
        )

        response = Response(
            TokenResponseSerializer({"access_token": access}).data,
            status=status.HTTP_201_CREATED,
        )

        AuthService.set_cookie_token(response, refresh)
        return response
