from rest_framework import serializers
from .models import Pet

class PetSerializer(serializers.ModelSerializer):
  nome_dono = serializers.CharField(source='dono.first_name', read_only=True)

  class Meta:
    model = Pet
    fields = ['id', 'nome', 'especies', 'raca', 'data_nasc', 'obs', 'is_active', 'dono', 'nome_dono']
    