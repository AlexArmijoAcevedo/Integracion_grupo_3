import pytest
from django.urls import reverse
from django.test import Client

@pytest.mark.django_db
class TestIntegracion:

    def setup_method(self):
        self.client = Client()

    def test_1_acceso_login(self):
        response = self.client.get(reverse('login'))
        assert response.status_code == 200
        assert b'<form' in response.content

    def test_2_acceso_index(self):
        response = self.client.get(reverse('index'))
        assert response.status_code == 200
        assert b'<html' in response.content  # Validación genérica para no depender de texto específico

    def test_3_acceso_about_us(self):
        response = self.client.get(reverse('about_us'))
        assert response.status_code == 200
        assert b'<html' in response.content

    def test_4_acceso_carrito(self):
        response = self.client.get(reverse('carrito'))
        assert response.status_code == 200
        assert b'<html' in response.content

    def test_5_renderizado_formulario_pago(self):
        response = self.client.get(reverse('pago'))
        assert response.status_code == 200
        assert b'name="numero"' in response.content or b'id="form-pago"' in response.content

    def test_6_simulacion_pago_exitoso(self):
        payload = {
            "nombre": "Juan Perez",
            "numero": "1234567812345678",  # No termina en '0', será aceptado
            "fecha": "12/30",
            "cvv": "123"
        }
        response = self.client.post(reverse('simular-webpay'), data=payload, content_type="application/json")
        assert response.status_code == 200
        assert response.json()['status'] == "aceptado"
