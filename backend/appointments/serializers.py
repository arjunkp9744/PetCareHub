from rest_framework import serializers

from .models import Appointment, Clinic, Veterinarian


class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = (
            "id",
            "name",
            "address",
            "city",
            "phone",
            "email",
            "opening_time",
            "closing_time",
            "is_active",
        )


class VeterinarianSerializer(serializers.ModelSerializer):
    clinic_name = serializers.CharField(
        source="clinic.name",
        read_only=True,
    )

    class Meta:
        model = Veterinarian
        fields = (
            "id",
            "clinic",
            "clinic_name",
            "full_name",
            "specialization",
            "phone",
            "email",
            "experience_years",
            "is_available",
        )


class AppointmentSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(
        source="pet.name",
        read_only=True,
    )

    clinic_name = serializers.CharField(
        source="clinic.name",
        read_only=True,
    )

    veterinarian_name = serializers.CharField(
        source="veterinarian.full_name",
        read_only=True,
    )

    class Meta:
        model = Appointment

        fields = (
            "id",
            "user",
            "pet",
            "pet_name",
            "clinic",
            "clinic_name",
            "veterinarian",
            "veterinarian_name",
            "appointment_date",
            "appointment_time",
            "reason",
            "status",
            "notes",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "user",
            "status",
            "created_at",
            "updated_at",
        )
    
def validate(self, attrs):
    request = self.context.get("request")

    pet = attrs.get(
        "pet",
        getattr(self.instance, "pet", None),
    )

    clinic = attrs.get(
        "clinic",
        getattr(self.instance, "clinic", None),
    )

    veterinarian = attrs.get(
        "veterinarian",
        getattr(self.instance, "veterinarian", None),
    )

    if pet and pet.owner != request.user:
        raise serializers.ValidationError(
            {
                "pet": (
                    "You can only book appointments "
                    "for your own pets."
                )
            }
        )

    if (
        clinic
        and veterinarian
        and veterinarian.clinic != clinic
    ):
        raise serializers.ValidationError(
            {
                "veterinarian": (
                    "The selected veterinarian does not belong "
                    "to the selected clinic."
                )
            }
        )

    if clinic and not clinic.is_active:
        raise serializers.ValidationError(
            {
                "clinic": "This clinic is currently unavailable."
            }
        )

    if veterinarian and not veterinarian.is_available:
        raise serializers.ValidationError(
            {
                "veterinarian": (
                    "This veterinarian is currently unavailable."
                )
            }
        )

    return attrs