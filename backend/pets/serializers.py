from rest_framework import serializers

from .models import Pet, Vaccination


class PetSerializer(serializers.ModelSerializer):
    """
    Serializer for creating, viewing, and updating pets.
    """

    owner_name = serializers.CharField(
        source="owner.full_name",
        read_only=True,
    )

    class Meta:
        model = Pet

        fields = (
            "id",
            "owner",
            "owner_name",
            "name",
            "image",
            "species",
            "breed",
            "gender",
            "date_of_birth",
            "weight",
            "color",
            "vaccination_status",
            "notes",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "owner",
            "owner_name",
            "created_at",
            "updated_at",
        )
class VaccinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaccination
        fields = [
                    "id",
                    "pet",
                    "vaccine_name",
                    "vaccination_date",
                    "next_due_date",
                    "clinic_name",
                    "notes",
                    "created_at",
                    "updated_at",
                ]        