from rest_framework import serializers

from .models import BoardingBooking, BoardingFacility


class BoardingFacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardingFacility

        fields = (
            "id",
            "name",
            "description",
            "address",
            "city",
            "phone",
            "email",
            "price_per_day",
            "is_active",
        )


class BoardingBookingSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(
        source="pet.name",
        read_only=True,
    )

    facility_name = serializers.CharField(
        source="facility.name",
        read_only=True,
    )

    class Meta:
        model = BoardingBooking

        fields = (
            "id",
            "user",
            "pet",
            "pet_name",
            "facility",
            "facility_name",
            "check_in_date",
            "check_out_date",
            "special_instructions",
            "total_amount",
            "status",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "user",
            "total_amount",
            "status",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        request = self.context.get("request")

        pet = attrs.get("pet")
        facility = attrs.get("facility")
        check_in = attrs.get("check_in_date")
        check_out = attrs.get("check_out_date")

        if pet and pet.owner != request.user:
            raise serializers.ValidationError(
                {
                    "pet": (
                        "You can only book boarding "
                        "for your own pets."
                    )
                }
            )

        if facility and not facility.is_active:
            raise serializers.ValidationError(
                {
                    "facility": (
                        "This boarding facility "
                        "is currently unavailable."
                    )
                }
            )

        if check_in and check_out:
            if check_out <= check_in:
                raise serializers.ValidationError(
                    {
                        "check_out_date": (
                            "Check-out date must be "
                            "after the check-in date."
                        )
                    }
                )

        return attrs