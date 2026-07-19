from enum import StrEnum


class TokenType(StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"


REFRESH_TOKEN_COOKIE = "refresh_token"


# Error Messages
ERROR_EMAIL_ALREADY_EXISTS = "User already exists"
ERROR_INVALID_CREDENTIALS = "Invalid Credentials"
ERROR_USER_INVALID = "Invalid User"
ERROR_INVALID_SESSION = "Invalid Session"
ERROR_INVALID_TOKEN_TYPE = "Invalid Token Type"
ERROR_TOKEN_EXPIRED = "Token Expired"
ERROR_INVALID_OR_MALFORMED_TOKEN = "Invalid Token"
