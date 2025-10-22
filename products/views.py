from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Products 
from .serializers import ProductsSerializer
from .permissions import IsAdminGroupOrReadOnly

class ProductsViewSet(viewsets.ModelViewSet):
    queryset = Products.objects.filter(ativo=True)
    serializer_class = ProductsSerializer
    permission_classes = [IsAdminGroupOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'preco': ['exact', 'lt', 'gt', 'lte', 'gte'],
        'data_validade': ['exact', 'lt', 'gt'],
        'categoria': ['exact'],
    }

    search_fields = ['nome', 'categoria', 'codigo']
    ordering_fields = ['preco', 'data_validade', 'nome']
    
    def perform_destroy(self, instance):
            instance.ativo = False
            instance.save()

def products_list(request):
    return render(request, 'products/products.html')

def products_create(request):
    return render(request, 'products/create.html')

def products_edit(request, id):
    return render(request, 'products/edit.html', {'id': id})