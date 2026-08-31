from django.conf import settings
from django.db import models


class Pet(models.Model):
    """
    Stores the basic details of a pet owned by a user.
    """

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pets",
    )

    name = models.CharField(max_length=100)

    image = models.ImageField(
    upload_to="pets/",
    null=True,
    blank=True,
    )

    species = models.CharField(max_length=50)

    breed = models.CharField(
        max_length=100,
        blank=True,
    )

    gender = models.CharField(
        max_length=20,
        blank=True,
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True,
    )

    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )

    color = models.CharField(
        max_length=50,
        blank=True,
    )

    vaccination_status = models.BooleanField(default=False)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Vaccination(models.Model):
    pet = models.ForeignKey(
        Pet,
        on_delete=models.CASCADE,
        related_name="vaccinations",
    )

    vaccine_name = models.CharField(
        max_length=100
    )

    vaccination_date = models.DateField()

    next_due_date = models.DateField(
        null=True,
        blank=True,
    )

    clinic_name = models.CharField(
        max_length=150,
        blank=True,
    )

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.pet.name} - "
            f"{self.vaccine_name}"
        )        