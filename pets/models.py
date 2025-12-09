from django.db import models
from django.conf import settings

class Pet(models.Model):

  class Especies(models.TextChoices):
    DOG = 'DOG', 'Cachorro'
    CAT = 'CAT', 'Gato'
    OTHER = 'OTHER', 'Outro'

  dono = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='pets',
    verbose_name='Dono',
  )

  nome = models.CharField(max_length=100)
  especies = models.CharField(max_length=10, choices=Especies.choices)
  raca = models.CharField(max_length=100, blank=True, null=True)
  data_nasc = models.DateField(verbose_name='Data de Nascimento')
  obs = models.TextField(blank=True, null=True)
  is_active = models.BooleanField(default=True)

  def __str__(self):
    return f"{self.nome} ({self.especies})"

  class Meta:
    verbose_name = "Pet"
    verbose_name_plural = "Pets"
    ordering = ["nome"]