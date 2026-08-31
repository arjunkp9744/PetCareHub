from django.urls import path

from .views import (
    GroomingBookingDetailView,
    GroomingBookingListCreateView,
    GroomingServiceListView,
)


urlpatterns = [
    path(
        "services/",
        GroomingServiceListView.as_view(),
        name="grooming-services",
    ),

    path(
        "bookings/",
        GroomingBookingListCreateView.as_view(),
        name="grooming-booking-list-create",
    ),

    path(
        "bookings/<int:pk>/",
        GroomingBookingDetailView.as_view(),
        name="grooming-booking-detail",
    ),
]