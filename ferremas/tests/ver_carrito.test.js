/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../taller_ferremas/templates/carrito.html'), 'utf8');

const {
  mostrarCarrito,
  actualizarCantidad,
  eliminarProducto
} = require('../taller_ferremas/static/JS/ver_carrito.js');

describe('Pruebas de carrito', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
    localStorage.clear();
  });

  test('1. Mostrar productos agregados al carrito', () => {
    const carritoMock = [
      { id: '1', nombre: 'Martillo', precio: 1000 },
      { id: '2', nombre: 'Taladro', precio: 2000 },
      { id: '1', nombre: 'Martillo', precio: 1000 }
    ];
    localStorage.setItem('carrito', JSON.stringify(carritoMock));

    mostrarCarrito();

    const filas = document.querySelectorAll('#carrito-container tr');
    expect(filas.length).toBe(2);

    const totalText = document.getElementById('total').textContent;
    expect(totalText).toContain('$4000');
  });

  test('2. Calcular precio total por cantidad', () => {
    const carritoMock = [
      { id: '1', nombre: 'Martillo', precio: 1000 },
      { id: '1', nombre: 'Martillo', precio: 1000 },
      { id: '1', nombre: 'Martillo', precio: 1000 }
    ];
    localStorage.setItem('carrito', JSON.stringify(carritoMock));

    mostrarCarrito();

    expect(document.getElementById('subtotal-1').textContent).toBe('$3000');
    expect(document.getElementById('total').textContent).toContain('$3000');
  });

  test('3 y 4. Modificar cantidad y actualizar total', () => {
    const carritoMock = [
      { id: '1', nombre: 'Martillo', precio: 1000 },
      { id: '1', nombre: 'Martillo', precio: 1000 }
    ];
    localStorage.setItem('carrito', JSON.stringify(carritoMock));

    mostrarCarrito();

    // Aumentar cantidad
    const btnAumentar = document.querySelector('.btn-aumentar[data-id="1"]');
    btnAumentar.click();

    expect(document.getElementById('cantidad-1').textContent).toBe('3');
    expect(document.getElementById('subtotal-1').textContent).toBe('$3000');
    expect(document.getElementById('total').textContent).toContain('$3000');

    // Disminuir cantidad
    const btnDisminuir = document.querySelector('.btn-disminuir[data-id="1"]');
    btnDisminuir.click();

    expect(document.getElementById('cantidad-1').textContent).toBe('2');
    expect(document.getElementById('subtotal-1').textContent).toBe('$2000');
    expect(document.getElementById('total').textContent).toContain('$2000');
  });

  test('5. Eliminar productos del carrito', () => {
    const carritoMock = [
      { id: '1', nombre: 'Martillo', precio: 1000 },
      { id: '2', nombre: 'Taladro', precio: 2000 }
    ];
    localStorage.setItem('carrito', JSON.stringify(carritoMock));

    mostrarCarrito();

    const btnEliminar = document.querySelector('.btn-eliminar[data-id="1"]');
    btnEliminar.click();

    const filas = document.querySelectorAll('#carrito-container tr');
    expect(filas.length).toBe(1);
    expect(filas[0].textContent).toContain('Taladro');
    expect(document.getElementById('total').textContent).toContain('$2000');
  });

  test('6. Mostrar mensaje si el carrito está vacío', () => {
    localStorage.setItem('carrito', JSON.stringify([]));

    mostrarCarrito();

    const filas = document.querySelectorAll('#carrito-container tr');
    expect(filas.length).toBe(0);
    expect(document.getElementById('total').textContent).toBe('$0');
  });
});
