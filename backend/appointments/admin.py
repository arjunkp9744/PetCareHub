from django.contrib import admin

from .models import Appointment, Clinic, Veterinarian


@admin.register(Clinic)
class ClinicAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "city",
        "phone",
        "opening_time",
        "closing_time",
        "is_active",
    )

    list_filter = (
        "city",
        "is_active",
    )

    search_fields = (
        "name",
        "city",
        "phone",
    )


@admin.register(Veterinarian)
class VeterinarianAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "clinic",
        "specialization",
        "experience_years",
        "is_available",
    )

    list_filter = (
        "clinic",
        "specialization",
        "is_available",
    )

    search_fields = (
        "full_name",
        "specialization",
        "clinic__name",
    )


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pet",
        "user",
        "clinic",
        "veterinarian",
        "appointment_date",
        "appointment_time",
        "status",
    )

    list_filter = (
        "status",
        "appointment_date",
        "clinic",
    )

    search_fields = (
        "pet__name",
        "user__email",
        "clinic__name",
        "veterinarian__full_name",
    )