from django.contrib import admin

from .models import BoardingBooking, BoardingFacility


@admin.register(BoardingFacility)
class BoardingFacilityAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "price_per_day",
        "is_active",
        "created_at",
    )

    list_filter = (
        "city",
        "is_active",
    )

    search_fields = (
        "name",
        "city",
        "phone",
        "email",
    )


@admin.register(BoardingBooking)
class BoardingBookingAdmin(admin.ModelAdmin):
    list_display = (
        "pet",
        "user",
        "facility",
        "check_in_date",
        "check_out_date",
        "total_amount",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "facility",
        "check_in_date",
    )

    search_fields = (
        "pet__name",
        "user__email",
        "facility__name",
    )

    readonly_fields = (
        "total_amount",
        "created_at",
        "updated_at",
    )