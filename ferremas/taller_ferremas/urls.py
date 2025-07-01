from django.urls import path
from . import views
from .views import simular_webpay

urlpatterns = [
    path('', views.login, name='login'),
    path('index', views.index, name='index'),
    path('agregar/', views.agregar_producto, name='agregar_producto'),
    path('carrito', views.carrito, name='carrito'),
        path('about_us', views.about_us, name='about_us'),
    path('api/dolar/', views.obtener_dolar, name='obtener_dolar'),
    path('pago', views.pago, name='pago'),
    path('simular-webpay', simular_webpay, name='simular-webpay'),
    #path('pago/', views.iniciar_pago, name='iniciar_pago'),
    #path('respuesta_pago/', views.respuesta_pago, name='respuesta_pago'),
]
