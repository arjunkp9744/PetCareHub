from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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


class LoginSerializer(TokenObtainPairSerializer):
    """
    Custom JWT login serializer.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["user"] = {
            "id": self.user.id,
            "full_name": self.user.full_name,
            "email": self.user.email,
            "role": self.user.role,
        }

        return data


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing and updating the logged-in user's profile.
    """

    class Meta:
        model = CustomUser

        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "role",
            "address",
            "city",
            "state",
            "pincode",
        )

        read_only_fields = (
            "id",
            "email",
            "role",
        )