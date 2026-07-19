import uuid
from typing import Any

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class CaseInsensitiveEmailField(models.EmailField):
    """
    Custom field that strips whitespace and lowercases email values
    upon database preparation, making lookups and saves case-insensitive.
    """

    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        if isinstance(value, str):
            return value.strip().lower()
        return value


class UserManager(BaseUserManager):
    def create_user(
        self, email: str, name: str, password=None, **extra_fields: Any
    ) -> "User":
        name = name.strip() if name else ""
        email = email.strip().lower() if email else ""

        if not name:
            raise ValueError("The Name Field must be set")
        if not email:
            raise ValueError("The Email Field must be set")

        email = self.normalize_email(email)

        # Automatically strip whitespace from any other string fields in extra_fields
        for key, value in extra_fields.items():
            if isinstance(value, str):
                value = value.strip()
                if key == "role":
                    value = value.lower()
                extra_fields[key] = value

        user = self.model(email=email, name=name, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("role", self.model.Role.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        USER = "user", "User"
        ADMIN = "admin", "Admin"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    email = CaseInsensitiveEmailField(unique=True)  # unique=True implies db_index=True
    role = models.CharField(
        max_length=20, choices=Role.choices, default=Role.USER, db_index=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects: UserManager = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]  # Sensible default ordering for queries/admin

    def __str__(self):
        return self.email

    def _normalize_fields(self):
        if not self.password:
            self.set_unusable_password()
        if self.name:
            self.name = self.name.strip()
        if self.email:
            self.email = self.email.strip().lower()

    def clean(self):
        """
        Model-level validation to ensure forms and Django Admin also
        strip whitespace and normalize emails before saving.
        """
        self._normalize_fields()
        super().clean()

    def full_clean(self, *args, **kwargs):
        self._normalize_fields()
        super().full_clean(*args, **kwargs)

    @property
    def is_admin(self) -> bool:
        """Helper property for quick role checks in code or templates."""
        return self.role == self.Role.ADMIN


class AuthIdentity(models.Model):
    class Provider(models.TextChoices):
        EMAIL = "email", "Email"
        GOOGLE = "google", "Google"
        GITHUB = "github", "Github"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="identities")
    provider = models.CharField(
        max_length=20, choices=Provider.choices, default=Provider.EMAIL
    )
    provider_user_id = models.CharField(max_length=255, null=True, blank=True)
    email = CaseInsensitiveEmailField(db_index=True)
    email_verified = models.BooleanField(default=False)
    password_hash = models.CharField(max_length=128, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "auth_identities"
        unique_together = ("provider", "email")


class AuthSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sessions")
    refresh_token_hash = models.CharField(max_length=128, null=True, blank=True)
    valid = models.BooleanField(default=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "auth_sessions"
