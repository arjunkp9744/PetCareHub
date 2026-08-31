from django.conf import settings
from django.db import models


class GroomingService(models.Model):
    name = models.CharField(max_length=100)

    description = models.TextField(
        blank=True
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    duration_minutes = models.PositiveIntegerField(
        default=60
    )

    is_available = models.BooleanField(
        default=True
    )

    def __str__(self):
        return self.name


class GroomingBooking(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="grooming_bookings",
    )

    pet = models.ForeignKey(
        "pets.Pet",
        on_delete=models.CASCADE,
        related_name="grooming_bookings",
    )

    service = models.ForeignKey(
        GroomingService,
        on_delete=models.PROTECT,
        related_name="bookings",
    )

    booking_date = models.DateField()

    booking_time = models.TimeField()

    notes = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
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
            f"{self.service.name} - "
            f"{self.booking_date}"
        )