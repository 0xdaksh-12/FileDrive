from datetime import timedelta
from unittest.mock import patch
import uuid

from django.conf import settings
from django.utils import timezone
from django.test import TestCase, RequestFactory
from django.db import IntegrityError
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User, AuthIdentity, AuthSession
from accounts.services_security import SecurityService
from accounts.services_auth import AuthService
from accounts.constants import TokenType


class UserManagerTests(TestCase):
    """Tests for user creation and manager edge cases."""

    def test_create_user_success(self):
        user = User.objects.create_user(
            email="test@filedrive.com", name="Test User", password="securepassword123"
        )
        self.assertEqual(user.email, "test@filedrive.com")
        self.assertEqual(user.name, "Test User")
        # This is used for admin panel access, so even if user somehow find /admin page.
        # They can't login
        self.assertTrue(user.check_password("securepassword123"))
        self.assertEqual(user.role, User.Role.USER)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_admin)

    def test_create_user_empty_email_raises_error(self):
        with self.assertRaisesMessage(ValueError, "The Email Field must be set"):
            User.objects.create_user(email="", name="No Email")

    def test_create_user_without_password(self):
        user = User.objects.create_user(email="nopass@filedrive.com", name="No Pass")
        self.assertFalse(user.has_usable_password())

    def test_create_user_strips_whitespace_from_email_and_name(self):
        """Ensure leading/trailing whitespace is stripped from core fields."""
        user = User.objects.create_user(
            email="  spaced@filedrive.com  ", name="  Test User  "
        )
        self.assertEqual(user.email, "spaced@filedrive.com")
        self.assertEqual(user.name, "Test User")

    def test_create_user_strips_whitespace_from_extra_fields(self):
        """Ensure string extra_fields are stripped while non-strings are untouched."""
        user = User.objects.create_user(
            email="extra@filedrive.com",
            name="Extra User",
            role="   ADMIN ",
            is_active=True,
        )
        self.assertEqual(user.role, "admin")
        self.assertTrue(user.is_active)

    def test_create_user_normalizes_email_domain(self):
        user = User.objects.create_user(
            email="user@FILEDRIVE.com", name="Normalized User"
        )
        self.assertEqual(user.email, "user@filedrive.com")

    def test_create_user_whitespace_only_email_raises_error(self):
        """Ensure an email containing only spaces is rejected after stripping."""
        with self.assertRaisesMessage(ValueError, "The Email Field must be set"):
            User.objects.create_user(email="   ", name="Space Email")

    def test_create_user_empty_name_raises_error(self):
        with self.assertRaisesMessage(ValueError, "The Name Field must be set"):
            User.objects.create_user(email="noname@filedrive.com", name="")

    def test_create_user_whitespace_only_name_raises_error(self):
        """Ensure a name containing only spaces is rejected after stripping."""
        with self.assertRaisesMessage(ValueError, "The Name Field must be set"):
            User.objects.create_user(email="noname@filedrive.com", name="   ")

    def test_create_user_with_none_values_raises_error(self):
        """Ensure passing None does not trigger AttributeError before raising ValueError."""
        with self.assertRaisesMessage(ValueError, "The Name Field must be set"):
            User.objects.create_user(email="valid@filedrive.com", name=None)  # type: ignore

        with self.assertRaisesMessage(ValueError, "The Email Field must be set"):
            User.objects.create_user(email=None, name="Valid Name")  # type: ignore

    def test_create_superuser_success(self):
        admin = User.objects.create_superuser(
            email="admin@filedrive.com", name="Admin User", password="adminpassword123"
        )

        self.assertEqual(admin.role, User.Role.ADMIN)
        self.assertTrue(admin.is_admin)
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.check_password("adminpassword123"))

    def test_create_superuser_invalid_staff_flag_raises_error(self):
        with self.assertRaisesMessage(ValueError, "Superuser must have is_staff=True."):
            User.objects.create_superuser(
                email="admin@filedrive.com", name="Admin", is_staff=False
            )

    def test_create_superuser_invalid_superuser_flag_raises_error(self):
        with self.assertRaisesMessage(
            ValueError, "Superuser must have is_superuser=True."
        ):
            User.objects.create_superuser(
                email="admin@filedrive.com", name="Admin", is_superuser=False
            )


class UserModelTests(TestCase):
    """Tests for the custom User model."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@filedrive.com",
            name="Test User",
            password="password123",
        )

    def test_string_representation(self):
        self.assertEqual(str(self.user), "test@filedrive.com")

    def test_id_is_uuid(self):
        self.assertIsInstance(self.user.id, uuid.UUID)

    def test_default_values(self):
        self.assertEqual(self.user.role, User.Role.USER)
        self.assertTrue(self.user.is_active)
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)
        self.assertFalse(self.user.is_admin)

    def test_is_admin_property(self):
        self.user.role = User.Role.ADMIN
        self.user.save()

        self.assertTrue(self.user.is_admin)

    def test_clean_strips_and_normalizes_fields(self):
        user = User(
            email="  USER@FILEDRIVE.COM  ",
            name="  Test User  ",
        )

        user.clean()

        self.assertEqual(user.email, "USER@filedrive.com")
        self.assertEqual(user.name, "Test User")

    def test_full_clean_strips_and_normalizes_fields(self):
        user = User(
            email="  TEST@FILEDRIVE.COM ",
            name="  Test User  ",
        )

        user.full_clean()

        self.assertEqual(user.email, "TEST@filedrive.com")
        self.assertEqual(user.name, "Test User")

    def test_email_must_be_unique(self):
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                email="test@filedrive.com",
                name="Duplicate User",
            )

    def test_default_ordering(self):
        older = User.objects.create_user(
            email="older@filedrive.com",
            name="Older",
        )

        newer = User.objects.create_user(
            email="newer@filedrive.com",
            name="Newer",
        )

        users = list(User.objects.all())

        self.assertEqual(users[0], newer)
        self.assertEqual(users[1], older)
        self.assertEqual(users[2], self.user)

    def test_db_table_name(self):
        self.assertEqual(User._meta.db_table, "users")

    def test_username_field(self):
        self.assertEqual(User.USERNAME_FIELD, "email")

    def test_required_fields(self):
        self.assertEqual(User.REQUIRED_FIELDS, ["name"])


class SecurityServiceTests(TestCase):
    """Tests for hashing, HMAC token verification, and JWT cryptographic operations."""

    def setUp(self):
        self.user_id = uuid.uuid4()
        self.session_id = uuid.uuid4()

    def test_bcrypt_hash_and_verify(self):
        secret = "MySecretPassword!123"
        hashed = SecurityService.hash_secret(secret)
        self.assertTrue(SecurityService.verify_secret(secret, hashed))
        self.assertFalse(SecurityService.verify_secret("WrongPassword", hashed))

    def test_bcrypt_truncation_edge_case(self):
        """
        Bcrypt fails on >72 bytes. Verify our truncation logic securely handles
        long strings and multi-byte UTF-8 characters without raising a ValueError.
        """
        long_password = "A" * 100
        hashed = SecurityService.hash_secret(long_password)
        self.assertTrue(SecurityService.verify_secret(long_password, hashed))

        # Verify exact 72-byte boundary match behavior
        self.assertTrue(SecurityService.verify_secret("A" * 72, hashed))
        self.assertFalse(SecurityService.verify_secret("A" * 71 + "B", hashed))

        # Multi-byte UTF-8 characters exceeding 72 bytes
        utf8_long_password = "🔒" * 30  # Each emoji is 4 bytes (120 bytes total)
        hashed_utf8 = SecurityService.hash_secret(utf8_long_password)
        self.assertTrue(SecurityService.verify_secret(utf8_long_password, hashed_utf8))

    def test_hmac_token_hash_and_verify(self):
        token = "raw-refresh-token-string"
        hashed = SecurityService.hash_token(token)
        self.assertNotEqual(token, hashed)
        self.assertTrue(SecurityService.verify_token(token, hashed))
        self.assertFalse(SecurityService.verify_token("tampered-token", hashed))

    def test_jwt_access_token_generation_and_verification(self):
        token = SecurityService.generate_access_token(self.user_id, self.session_id)
        payload = SecurityService.verify_jwt(token, expected_type=TokenType.ACCESS)

        self.assertEqual(payload["sub"], str(self.user_id))
        self.assertEqual(payload["sid"], str(self.session_id))
        self.assertEqual(payload["type"], TokenType.ACCESS)

    def test_jwt_refresh_token_generation_and_verification(self):
        token = SecurityService.generate_refresh_token(self.user_id, self.session_id)
        payload = SecurityService.verify_jwt(token, expected_type=TokenType.REFRESH)

        self.assertEqual(payload["type"], TokenType.REFRESH)

    def test_jwt_token_type_confusion_attack(self):
        """Ensure an access token cannot be verified against a refresh token check, and vice versa."""
        access_token = SecurityService.generate_access_token(
            self.user_id, self.session_id
        )
        refresh_token = SecurityService.generate_refresh_token(
            self.user_id, self.session_id
        )

        with self.assertRaises(AuthenticationFailed):
            SecurityService.verify_jwt(access_token, expected_type=TokenType.REFRESH)

        with self.assertRaises(AuthenticationFailed):
            SecurityService.verify_jwt(refresh_token, expected_type=TokenType.ACCESS)

    def test_jwt_expired_token_raises_auth_failed(self):
        """Simulate time travel to ensure expired JWTs are strictly rejected."""
        with patch("accounts.services_security.timezone.now") as mock_now:
            # Issue token in the past
            past_time = timezone.now() - timedelta(days=10)
            mock_now.return_value = past_time
            token = SecurityService.generate_access_token(self.user_id, self.session_id)

        # Verify at real current time
        with self.assertRaisesMessage(AuthenticationFailed, "Token has expired"):
            SecurityService.verify_jwt(token, expected_type=TokenType.ACCESS)

    def test_jwt_invalid_signature_or_malformed_token(self):
        with self.assertRaisesMessage(
            AuthenticationFailed, "Invalid or malformed token"
        ):
            SecurityService.verify_jwt(
                "not.a.valid.jwt", expected_type=TokenType.ACCESS
            )

        # Tamper with a valid token payload
        valid_token = SecurityService.generate_access_token(
            self.user_id, self.session_id
        )
        header, payload, signature = valid_token.split(".")
        tampered_token = f"{header}.{payload}tampered.{signature}"

        with self.assertRaisesMessage(
            AuthenticationFailed, "Invalid or malformed token"
        ):
            SecurityService.verify_jwt(tampered_token, expected_type=TokenType.ACCESS)


class AuthServiceTests(TestCase):
    """Tests for service-level business logic and session metadata extraction."""

    def setUp(self):
        self.factory = RequestFactory()
        self.register_data = {
            "name": "Test User",
            "email": "test@filedrive.com",
            "password": "strongpassword456",
        }

    def test_register_creates_user_identity_and_session(self):
        request = self.factory.post(
            "/api/auth/register",
            REMOTE_ADDR="192.168.1.1",
            headers={"User-Agent": "Mozilla/5.0 TestBrowser"},
        )

        access, refresh = AuthService.register(
            name=self.register_data["name"],
            email=self.register_data["email"],
            password=self.register_data["password"],
            request=request,
        )

        self.assertTrue(access)
        self.assertTrue(refresh)

        user = User.objects.get(email="test@filedrive.com")
        self.assertEqual(user.name, "Test User")

        identity = AuthIdentity.objects.get(user=user)
        self.assertEqual(identity.provider, AuthIdentity.Provider.EMAIL)
        self.assertTrue(
            SecurityService.verify_secret("strongpassword456", identity.password_hash)
        )

        session = AuthSession.objects.get(user=user)
        self.assertEqual(session.ip_address, "192.168.1.1")
        self.assertEqual(session.user_agent, "Mozilla/5.0 TestBrowser")
        self.assertTrue(
            SecurityService.verify_token(refresh, session.refresh_token_hash)
        )

    def test_register_duplicate_email_raises_validation_error(self):
        AuthService.register(**self.register_data)
        with self.assertRaises(ValidationError) as ctx:
            AuthService.register(**self.register_data)

        self.assertIn("User with this email already exists", str(ctx.exception.detail))

    def test_create_session_x_forwarded_for_parsing(self):
        """Verify the client IP is correctly extracted from multi-hop proxy headers."""
        request = self.factory.post(
            "/api/auth/register",
            REMOTE_ADDR="127.0.0.1",
            headers={"X-Forwarded-For": "203.0.113.195, 70.41.3.18, 150.172.238.178"},
        )

        user = User.objects.create_user(email="proxy@filedrive.com", name="Proxy User")
        session = AuthService._create_session(user, request)

        self.assertEqual(session.ip_address, "203.0.113.195")

    def test_create_session_user_agent_truncation(self):
        """Ensure User-Agent strings exceeding the 512 max_length are safely truncated."""
        long_user_agent = "A" * 600
        request = self.factory.post(
            "/api/auth/register",
            REMOTE_ADDR="127.0.0.1",
            headers={"User-Agent": long_user_agent},
        )

        user = User.objects.create_user(email="ua@filedrive.com", name="UA User")
        session = AuthService._create_session(user, request)

        self.assertEqual(len(session.user_agent), 512)
        self.assertEqual(session.user_agent, "A" * 512)

    def test_create_session_x_real_ip_only(self):
        """Verify client IP is correctly extracted from X-Real-IP header if X-Forwarded-For is missing."""
        request = self.factory.post(
            "/api/auth/register",
            REMOTE_ADDR="127.0.0.1",
            headers={"X-Real-IP": "198.51.100.42"},
        )
        user = User.objects.create_user(email="realip@filedrive.com", name="Real IP User")
        session = AuthService._create_session(user, request)
        self.assertEqual(session.ip_address, "198.51.100.42")

    def test_create_session_remote_addr_fallback(self):
        """Verify client IP falls back to REMOTE_ADDR when both proxy headers are absent."""
        request = self.factory.post(
            "/api/auth/register",
            REMOTE_ADDR="198.51.100.99",
        )
        user = User.objects.create_user(email="fallbackip@filedrive.com", name="Fallback IP User")
        session = AuthService._create_session(user, request)
        self.assertEqual(session.ip_address, "198.51.100.99")

    def test_create_session_no_request(self):
        """Verify that when request is None, session is created with null IP and User-Agent."""
        user = User.objects.create_user(email="norequest@filedrive.com", name="No Request User")
        session = AuthService._create_session(user, request=None)
        self.assertIsNone(session.ip_address)
        self.assertIsNone(session.user_agent)

    def test_register_normalization(self):
        """Verify register normalizes/trims user inputs."""
        access, refresh = AuthService.register(
            name="  Trimmed Name  ",
            email="  NORMALIZED@filedrive.com  ",
            password="testpassword123",
        )
        user = User.objects.get(email="NORMALIZED@filedrive.com")
        self.assertEqual(user.name, "Trimmed Name")
        self.assertEqual(user.email, "NORMALIZED@filedrive.com")




class RegisterViewTests(APITestCase):
    """Integration tests for the /api/auth/register endpoint."""

    def setUp(self):
        self.url = "/api/auth/register"
        self.valid_payload = {
            "name": "Test User",
            "email": "test@filedrive.com",
            "password": "Password123!",
        }

    def test_register_endpoint_success(self):
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access_token", response.data)
        self.assertEqual(response.data["token_type"], "bearer")

        # Verify HttpOnly Cookie generation
        self.assertIn("refresh_token", response.cookies)
        cookie = response.cookies["refresh_token"]

        self.assertIsNotNone(cookie)
        self.assertTrue(cookie["httponly"])
        self.assertEqual(cookie["path"], "/api/auth")

        # In test mode DEBUG=True by default, checking SameSite/Secure adaptation
        is_prod = getattr(settings, "DEBUG", True) is False
        self.assertEqual(cookie["samesite"], "None" if is_prod else "Lax")
        self.assertEqual(cookie["secure"], "" if not is_prod else True)

    def test_register_duplicate_email_returns_400(self):
        self.client.post(self.url, self.valid_payload, format="json")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)
        self.assertEqual(
            str(response.data["detail"]), "User with this email already exists"
        )

    def test_register_validation_name_boundaries(self):
        # Name too short (min_length=2)
        payload = {**self.valid_payload, "name": "A"}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

        # Name too long (max_length=100)
        payload = {**self.valid_payload, "name": "A" * 101}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_register_validation_email_formats(self):
        # Invalid email syntax
        payload = {**self.valid_payload, "email": "not-an-email-address"}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

        # Empty email
        payload = {**self.valid_payload, "email": ""}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_validation_password_boundaries(self):
        # Password too short (min_length=8)
        payload = {**self.valid_payload, "password": "short"}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

        # Password too long (max_length=128)
        payload = {**self.valid_payload, "password": "P" * 129}
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_missing_required_fields(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)
