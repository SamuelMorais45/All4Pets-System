from rest_framework import serializers
from .models import Products

class ProductsSeriaizer(serializers.ModelSerializer):
    class Meta:
        fields = {
            'id', 'codigo', 'nome', 'descricao', 'preco',
            'estoque', 'categoria', 'data_validade', 'ativo',
            'criado_em', 'atualizado_em'
        }
        read_only_fields = {'id', 'criado_em', 'atualizado_em', 'ativo'}