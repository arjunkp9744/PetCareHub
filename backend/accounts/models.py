from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    """
    Custom user model for PetCare Hub.
    """

    class Role(models.TextChoices):
        PET_OWNER = "PET_OWNER", "Pet Owner"
        VETERINARIAN = "VETERINARIAN", "Veterinarian"
        GROOMER = "GROOMER", "Groomer"
        BOARDING_PROVIDER = "BOARDING_PROVIDER", "Boarding Provider"
        ADMIN = "ADMIN", "Admin"
        SHELTER = "SHELTER", "Shelter / NGO"

    username = None

    full_name = models.CharField(
        max_length=150,
        blank=True,
    )

    email = models.EmailField(
        unique=True,
    )

    phone = models.CharField(
        max_length=15,
        blank=True,
    )

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.PET_OWNER,
    )

    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
        null=True,
    )

    address = models.TextField(
        blank=True,
    )

    city = models.CharField(
        max_length=100,
        blank=True,
    )

    state = models.CharField(
        max_length=100,
        blank=True,
    )

    pincode = models.CharField(
        max_length=10,
        blank=True,
    )

    is_verified = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []