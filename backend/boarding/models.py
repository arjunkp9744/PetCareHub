from django.conf import settings
from django.db import models

from pets.models import Pet


class BoardingFacility(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    address = models.TextField()
    city = models.CharField(max_length=100)

    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)

    price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name


class BoardingBooking(models.Model):

    class BookingStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="boarding_bookings",
    )

    pet = models.ForeignKey(
        Pet,
        on_delete=models.CASCADE,
        related_name="boarding_bookings",
    )

    facility = models.ForeignKey(
        BoardingFacility,
        on_delete=models.PROTECT,
        related_name="bookings",
    )

    check_in_date = models.DateField()
    check_out_date = models.DateField()

    special_instructions = models.TextField(
        blank=True
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING,
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
            f"{self.facility.name}"
        )