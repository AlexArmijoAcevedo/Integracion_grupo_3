from django.db import models

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)

class Pedido(models.Model):
    uid_usuario = models.CharField(max_length=100)  # UID de Firebase
    productos = models.JSONField()  # lista de productos (ID, nombre, precio)
    direccion = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
