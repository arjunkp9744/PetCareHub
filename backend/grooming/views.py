from rest_framework import generics
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from .models import (
    GroomingBooking,
    GroomingService,
)

from .serializers import (
    GroomingBookingSerializer,
    GroomingServiceSerializer,
)


class GroomingServiceListView(
    generics.ListAPIView
):
    """
    Displays all available grooming services.
    """

    serializer_class = GroomingServiceSerializer

    permission_classes = [AllowAny]

    def get_queryset(self):
        return GroomingService.objects.filter(
            is_available=True
        )


class GroomingBookingListCreateView(
    generics.ListCreateAPIView
):
    """
    Lists the logged-in user's grooming bookings
    and allows them to create a new booking.
    """

    serializer_class = GroomingBookingSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            GroomingBooking.objects
            .filter(user=self.request.user)
            .select_related(
                "pet",
                "service",
            )
            .order_by(
                "-booking_date",
                "-booking_time",
            )
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class GroomingBookingDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Allows the logged-in user to view, update,
    or delete their own grooming booking.
    """

    serializer_class = GroomingBookingSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GroomingBooking.objects.filter(
            user=self.request.user
        )