from django.shortcuts import render, redirect
from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Products 
from .serializers import ProductsSerializer
from .permissions import IsAdminGroupOrReadOnly
from .forms import ProductForm

class ProductsViewSet(viewsets.ModelViewSet):
    
    
    serializer_class = ProductsSerializer
    permission_classes = [IsAdminGroupOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'preco': ['exact', 'lt', 'gt', 'lte', 'gte'],
        'data_validade': ['exact', 'lt', 'gt'],
        'categoria': ['exact'],
    }

    search_fields = ['nome', 'categoria', 'codigo', 'data_validade']
    ordering_fields = ['preco', 'data_validade', 'nome']
    
    def get_queryset(self):
        return Products.objects.filter(ativo=True)
    
    def perform_destroy(self, instance):
            instance.ativo = False
            instance.save()

def products_list(request):
    is_admin = request.user.groups.filter(name = 'Administrador').exists()
    produtos = Products.objects.filter(ativo=True)
    context ={
        'produtos': produtos,
        'is_admin': is_admin
    }
    return render(request, 'products/products.html', context)

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