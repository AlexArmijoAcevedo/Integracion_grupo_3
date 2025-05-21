from django.shortcuts import render, redirect
from .models import Producto,Pedido
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from firebase_admin import credentials, firestore, auth
from django.http import HttpResponse
import json
import firebase_admin
import os






BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

cred_path = os.path.join(BASE_DIR, 'ferremas-cb091-firebase-adminsdk-fbsvc-21b84e0082.json')

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

db = firestore.client()


def index(request):
    productos = Producto.objects.all()
    return render(request, 'index.html',{'productos':productos})
def login(request):
    if request.method == 'POST':
        token = request.POST.get('token') 
        if token:
            response = redirect('index')
            response.set_cookie('token', token)
            return response
        else:
            return render(request, 'login.html', {'error': 'Credenciales inválidas'})
    else:
        return render(request, 'login.html')
def agregar_producto(request):
    return render(request, 'agregar_producto.html')
def admin_pagina(request):
    id_token = request.COOKIES.get('token')
    if not id_token:
        return redirect('login') 

    try:
        decoded_token = auth.verify_id_token(id_token)
        user_uid = decoded_token['uid']
        doc_ref = db.collection('usuarios').document(user_uid)
        doc = doc_ref.get()

        if doc.exists and doc.to_dict().get('rol') == 'admin':
            return render(request, 'admin_pagina.html')
        else:
            return redirect('index')

    except Exception as e:
        print(f"Error de autenticación: {e}")
        return redirect('login')









def registrar_pedido(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Pedido.objects.create(**data)
        return JsonResponse({'ok': True})