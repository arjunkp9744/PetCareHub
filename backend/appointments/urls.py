from django.urls import path

from .views import (
    AppointmentDetailView,
    AppointmentListCreateView,
    ClinicListView,
    VeterinarianListView,
)


urlpatterns = [
    path(
        "",
        AppointmentListCreateView.as_view(),
        name="appointment-list-create",
    ),
    path(
        "clinics/",
        ClinicListView.as_view(),
        name="clinic-list",
    ),
    path(
        "veterinarians/",
        VeterinarianListView.as_view(),
        name="veterinarian-list",
    ),
    path(
    "<int:pk>/",
    AppointmentDetailView.as_view(),
    name="appointment-detail",
    ),
]