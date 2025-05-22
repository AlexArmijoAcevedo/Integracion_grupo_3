from django.shortcuts import render
from .models import Producto,Pedido
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json


def index(request):
    productos = Producto.objects.all()
    return render(request, 'index.html',{'productos':productos})
def login(request):
    return render(request, 'login.html')
def agregar_producto(request):
    return render(request, 'agregar_producto.html')
def carrito (request):
    return render(request, 'carrito.html')
def about_us(request):
    return render(request, 'about_us.html')

def registrar_pedido(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # uid_usuario, productos, direccion, total
        Pedido.objects.create(**data)
        return JsonResponse({'ok': True})
    
def obtener_dolar(request):
    url = "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx"
    today = date.today().strftime("%Y-%m-%d")
    params = {
        "user": "guest",
        "pass": "guest",
        "function": "F073.TCO.PRE.Z.D",
        "firstdate": today,
        "lastdate": today
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return JsonResponse({"xml": response.text})
    else:
        return JsonResponse({"error": "No se pudo obtener el valor del dólar"})

