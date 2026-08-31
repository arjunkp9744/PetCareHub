from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Appointment, Clinic, Veterinarian
from .serializers import (
    AppointmentSerializer,
    ClinicSerializer,
    VeterinarianSerializer,
)


class ClinicListView(generics.ListAPIView):
    """
    Displays all active clinics.
    """

    serializer_class = ClinicSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Clinic.objects.filter(is_active=True)


class VeterinarianListView(generics.ListAPIView):
    """
    Displays available veterinarians.
    """

    serializer_class = VeterinarianSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Veterinarian.objects.filter(
            is_available=True,
            clinic__is_active=True,
        )

        clinic_id = self.request.query_params.get("clinic")

        if clinic_id:
            queryset = queryset.filter(clinic_id=clinic_id)

        return queryset


class AppointmentListCreateView(generics.ListCreateAPIView):
    """
    Lists the logged-in user's appointments
    and allows them to create a new appointment.
    """

    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(
            user=self.request.user
        ).order_by("-appointment_date", "-appointment_time")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AppointmentDetailView(
    generics.RetrieveUpdateDestroyAPIView):
    """
    Allows the logged-in user to view, update,
    or delete one of their appointments.
    """

    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(
            user=self.request.user
        )    