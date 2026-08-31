from django.urls import path

from .views import (
    BoardingBookingCancelView,
    BoardingBookingDetailView,
    BoardingBookingListCreateView,
    BoardingFacilityListView,
)


urlpatterns = [
    path(
        "facilities/",
        BoardingFacilityListView.as_view(),
        name="boarding-facility-list",
    ),

    path(
        "bookings/",
        BoardingBookingListCreateView.as_view(),
        name="boarding-booking-list-create",
    ),

    path(
        "bookings/<int:pk>/",
        BoardingBookingDetailView.as_view(),
        name="boarding-booking-detail",
    ),
    path(
    "bookings/<int:pk>/cancel/",
    BoardingBookingCancelView.as_view(),
    name="boarding-booking-cancel",
   ),
]