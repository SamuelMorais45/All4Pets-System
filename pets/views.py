from rest_framework import viewsets, permissions
from .models import Pet
from .serializers import PetSerializer

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.filter(is_active=True)
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(dono=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()