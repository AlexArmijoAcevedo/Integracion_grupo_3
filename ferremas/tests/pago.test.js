/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

describe('Formulario de pago', () => {
  let inicializarFormularioPago;

  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, '../taller_ferremas/templates/pago.html'),
      'utf8'
    );
    document.documentElement.innerHTML = html;
    jest.resetModules();
    inicializarFormularioPago = require('../taller_ferremas/static/JS/pago.js').inicializarFormularioPago;
    inicializarFormularioPago();
  });

  function submitForm() {
    const form = document.getElementById('form-pago');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  test('1. Validar que el formulario de pago se muestre', () => {
    expect(document.getElementById('form-pago')).not.toBeNull();
  });

  test('2. Validar campos obligatorios (tarjeta, fecha, CVV)', () => {
    document.getElementById('nombre').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('cvv').value = '';
    submitForm();
    const mensaje = document.getElementById('mensaje').textContent;
    expect(mensaje).toMatch(/obligatorios|errores/i);
  });

  test('3. Validar que no se pueda enviar si hay errores', () => {
    document.getElementById('nombre').value = 'Juan';
    document.getElementById('numero').value = '1234';
    document.getElementById('fecha').value = '2024-12';
    document.getElementById('cvv').value = '1';
    submitForm();
    const mensaje = document.getElementById('mensaje').textContent;
    expect(mensaje).toMatch(/formulario contiene errores/i);
  });

  test('4. Validar que WebPay rechace transacciones inválidas (simulación)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ status: 'rechazado' }) })
    );
    document.getElementById('nombre').value = 'Juan Pérez';
    document.getElementById('numero').value = '1234567812345678';
    document.getElementById('fecha').value = '2024-12';
    document.getElementById('cvv').value = '123';
    submitForm();
    await new Promise(r => setTimeout(r, 50));
    expect(document.getElementById('mensaje').textContent).toMatch(/rechazada/i);
  });

  test('5. Mostrar mensaje de éxito o error tras enviar pago', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'aceptado' }) })
    );
    document.getElementById('nombre').value = 'Juan Pérez';
    document.getElementById('numero').value = '1234567812345678';
    document.getElementById('fecha').value = '2024-12';
    document.getElementById('cvv').value = '123';
    submitForm();
    await new Promise(r => setTimeout(r, 50));
    expect(document.getElementById('mensaje').textContent).toMatch(/pago.*exitoso/i);
  });

  test('6. Validar que el botón de pagar tenga estado loading durante envío', async () => {
    global.fetch = jest.fn(() =>
      new Promise(resolve =>
        setTimeout(() =>
          resolve({ ok: true, json: () => Promise.resolve({ status: 'aceptado' }) }), 100)
      )
    );
    const btn = document.getElementById('btn-pagar');
    document.getElementById('nombre').value = 'Juan Pérez';
    document.getElementById('numero').value = '1234567812345678';
    document.getElementById('fecha').value = '2024-12';
    document.getElementById('cvv').value = '123';
    submitForm();
    expect(btn.disabled).toBe(true);
    expect(btn.textContent.toLowerCase()).toMatch(/enviando|loading/);
    await new Promise(r => setTimeout(r, 150));
    expect(btn.disabled).toBe(false);
  });
});
