from decimal import Decimal

from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import BoardingBooking, BoardingFacility
from .serializers import (
    BoardingBookingSerializer,
    BoardingFacilitySerializer,
)


class BoardingFacilityListView(generics.ListAPIView):
    """
    Displays all active boarding facilities.
    """

    serializer_class = BoardingFacilitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return BoardingFacility.objects.filter(
            is_active=True
        ).order_by("name")


class BoardingBookingListCreateView(
    generics.ListCreateAPIView
):
    """
    Lists the logged-in user's boarding bookings
    and allows them to create a new booking.
    """

    serializer_class = BoardingBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BoardingBooking.objects.filter(
            user=self.request.user
        ).select_related(
            "pet",
            "facility",
        ).order_by(
            "-created_at"
        )

    def perform_create(self, serializer):
        facility = serializer.validated_data["facility"]
        check_in = serializer.validated_data["check_in_date"]
        check_out = serializer.validated_data["check_out_date"]

        days = (check_out - check_in).days

        total_amount = (
            facility.price_per_day * Decimal(days)
        )

        serializer.save(
            user=self.request.user,
            total_amount=total_amount,
        )

class BoardingBookingDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Allows the logged-in user to view, update,
    or delete one of their own boarding bookings.
    """

    serializer_class = BoardingBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BoardingBooking.objects.filter(
            user=self.request.user
        )

class BoardingBookingCancelView(generics.GenericAPIView):
    serializer_class = BoardingBookingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            booking = BoardingBooking.objects.get(
                id=pk,
                user=request.user,
            )
        except BoardingBooking.DoesNotExist:
            return Response(
                {
                    "detail": "Booking not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if booking.status == BoardingBooking.BookingStatus.CANCELLED:
            return Response(
                {
                    "detail": "Booking is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if booking.status == BoardingBooking.BookingStatus.COMPLETED:
            return Response(
                {
                    "detail": "Completed bookings cannot be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = (
            BoardingBooking.BookingStatus.CANCELLED
        )

        booking.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "detail": "Booking cancelled successfully."
            },
            status=status.HTTP_200_OK,
        )