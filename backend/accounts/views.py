from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer,LoginSerializer,ProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny



class RegisterView(APIView):
    """
    API for user registration.
    """

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "User registered successfully."
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
    
class ProfileView(APIView):
    """
    API for viewing and updating the logged-in user's profile.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)

        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Profile updated successfully.",
                    "user": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class CreateAdminView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        User = get_user_model()

        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "User with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_superuser(
            email=email,
            password=password,
            full_name="PetCareHub Admin",
            role=User.Role.ADMIN,
        )

        return Response(
            {
                "message": "Admin created successfully.",
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )    

