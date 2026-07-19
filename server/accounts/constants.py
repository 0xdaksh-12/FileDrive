from enum import StrEnum


class TokenType(StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"


REFRESH_TOKEN_COOKIE = "refresh_token"

