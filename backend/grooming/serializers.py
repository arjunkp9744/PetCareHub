from rest_framework import serializers

from .models import GroomingBooking, GroomingService


class GroomingServiceSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = GroomingService

        fields = (
            "id",
            "name",
            "description",
            "price",
            "duration_minutes",
            "is_available",
        )


class GroomingBookingSerializer(
    serializers.ModelSerializer
):
    pet_name = serializers.CharField(
        source="pet.name",
        read_only=True,
    )

    service_name = serializers.CharField(
        source="service.name",
        read_only=True,
    )

    service_price = serializers.DecimalField(
        source="service.price",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = GroomingBooking

        fields = (
            "id",
            "user",
            "pet",
            "pet_name",
            "service",
            "service_name",
            "service_price",
            "booking_date",
            "booking_time",
            "notes",
            "status",
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

        pet = attrs.get("pet")

        service = attrs.get("service")

        if pet and pet.owner != request.user:
            raise serializers.ValidationError(
                {
                    "pet": (
                        "You can only book grooming "
                        "for your own pets."
                    )
                }
            )

        if service and not service.is_available:
            raise serializers.ValidationError(
                {
                    "service": (
                        "This grooming service "
                        "is currently unavailable."
                    )
                }
            )

        return attrs