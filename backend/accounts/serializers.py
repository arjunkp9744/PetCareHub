from rest_framework import serializers

from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new user.
    """

    class Meta:
        model = CustomUser

        fields = (
            "full_name",
            "email",
            "phone",
            "password",
            "role",
            "address",
            "city",
            "state",
            "pincode",
        )

        extra_kwargs = {
            "password": {"write_only": True}
        }
    
def create(self, validated_data):
    """
     Create a new user with a hashed password.
    """

    password = validated_data.pop("password")

    user = CustomUser(**validated_data)

    user.set_password(password)

    user.save()

    return user
            