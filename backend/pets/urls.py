from django.urls import path

from .views import PetDetailView, PetListCreateView, VaccinationListCreateView


urlpatterns = [
    path("", PetListCreateView.as_view(), name="pet-list-create"),
    path("<int:pk>/", PetDetailView.as_view(), name="pet-detail"),
    path("vaccinations/", VaccinationListCreateView.as_view(), name="vaccination-list-create",
),
]