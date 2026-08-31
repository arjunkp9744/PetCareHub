from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Pet, Vaccination
from .serializers import PetSerializer, VaccinationSerializer


class PetListCreateView(generics.ListCreateAPIView):
    """
    API for listing the logged-in user's pets
    and creating a new pet.
    """

    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pet.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API for viewing, updating, and deleting one pet
    owned by the logged-in user.
    """

    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pet.objects.filter(owner=self.request.user)
class VaccinationListCreateView(generics.ListCreateAPIView):
    serializer_class = VaccinationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Vaccination.objects.filter(
            pet__owner=self.request.user
    )

        pet_id = self.request.query_params.get("pet")

        if pet_id:
           queryset = queryset.filter(
            pet_id=pet_id
        )

        return queryset.order_by(
        "-vaccination_date"
    )
    def perform_create(self, serializer):
        pet = serializer.validated_data["pet"]

        if pet.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You cannot add vaccination records "
                "for another user's pet."
            )

        serializer.save()    