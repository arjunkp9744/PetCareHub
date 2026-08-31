from django.contrib import admin

from .models import Pet


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "species",
        "breed",
        "owner",
        "vaccination_status",
        "created_at",
    )

    list_filter = (
        "species",
        "vaccination_status",
        "gender",
    )

    search_fields = (
        "name",
        "breed",
        "owner__email",
    )