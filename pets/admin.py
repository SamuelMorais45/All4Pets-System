from django.contrib import admin
from .models import Pet

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
  list_display = ('dono', 'nome', 'especies', 'is_active')
  list_filter = ('dono', 'especies', 'is_active')
  search_fields = ('nome', 'dono_email')