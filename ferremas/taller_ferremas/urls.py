from django.urls import path
from . import views

urlpatterns = [
    path('', views.login, name='login'),
    path('index', views.index, name='index'),
    path('agregar/', views.agregar_producto, name='agregar_producto'),
    path('carrito', views.carrito, name='carrito'),
]
