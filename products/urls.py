from django.urls import path
from . import views

urlpatterns = [
    path('', views.produtos_list, name='products_list'),
    path('create/', views.produtos_create, name='products_create'),
    path('edit/<int:id>/', views.produtos_edit, name='products_edit'),
]