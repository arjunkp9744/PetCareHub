from django.contrib import admin

from .models import GroomingService, GroomingBooking


@admin.register(GroomingService)
class GroomingServiceAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "price",
        "duration_minutes",
        "is_available",
    )

@admin.register(GroomingBooking)
class GroomingBookingAdmin(admin.ModelAdmin):
    list_display = (
        "pet",
        "service",
        "booking_date",
        "booking_time",
        "status",
    )    