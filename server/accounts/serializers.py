from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)


class TokenResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    token_type = serializers.CharField(default="bearer")


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)
