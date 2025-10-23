from django.shortcuts import render, redirect
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Products 
from .serializers import ProductsSerializer
from .permissions import IsAdminGroupOrReadOnly
from .forms import ProductForm

class ProductsViewSet(viewsets.ModelViewSet):
    
    
    serializer_class = ProductsSerializer
   # permission_classes = [IsAdminGroupOrReadOnly]#
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'preco': ['exact', 'lt', 'gt', 'lte', 'gte'],
        'data_validade': ['exact', 'lt', 'gt'],
        'categoria': ['exact'],
    }

    search_fields = ['nome', 'categoria', 'codigo', 'data_validade']
    ordering_fields = ['preco', 'data_validade', 'nome']
    
    # ADICIONADO: O método get_queryset para definir a queryset base
    def get_queryset(self):
        # Esta é a queryset inicial. O SearchFilter será aplicado em cima dela.
        return Products.objects.filter(ativo=True)
    
    def perform_destroy(self, instance):
            instance.ativo = False
            instance.save()

def products_list(request):
    produtos = Products.objects.filter(ativo=True)
    return render(request, 'products/products.html', {'produtos': produtos})

def products_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('products_list') 
    else:
        form = ProductForm()
    
    return render(request, 'products/create.html', {'form': form})

def products_edit(request, id):
    return render(request, 'products/edit.html', {'id': id})