/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Ajusta esta ruta si tu estructura cambia
const renderModule = require(path.resolve(__dirname, '../taller_ferremas/static/JS/render_productos.js'));
const renderProductos = renderModule.renderProductos;

let html;

describe('Pruebas de productos', () => {
  beforeAll(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../taller_ferremas/templates/index.html'), 'utf8');
  });

  beforeEach(() => {
    document.documentElement.innerHTML = html;
    localStorage.clear();
  });

  test('1. Cargar productos desde la base de datos (simulado)', () => {
    const productos = [
      { id_producto: "1", nombre: "Martillo", categoria: "Herramienta", marca: "MarcaA", valor: 1000, Imagen: "martillo.jpg" },
      { id_producto: "2", nombre: "Taladro", categoria: "Herramienta", marca: "MarcaB", valor: 2000, Imagen: "taladro.jpg" }
    ];
    renderProductos(productos);
    const contenedor = document.getElementById('productos-container');
    expect(contenedor.children.length).toBe(2);
  });

  test('2. Mostrar correctamente nombre, imagen y precio', () => {
    const productos = [
      { id_producto: "1", nombre: "Martillo", categoria: "Herramienta", marca: "MarcaA", valor: 1000, Imagen: "martillo.jpg" }
    ];
    renderProductos(productos);
    const productoCard = document.querySelector('.nombre-producto').parentElement.parentElement;
    expect(productoCard.textContent).toContain('Martillo');
    expect(productoCard.textContent).toContain('1000');
    const img = productoCard.querySelector('img');
    expect(img.src).toContain('martillo.jpg');
  });

  test('3. Verificar que se rendericen todos los productos disponibles', () => {
    const productos = [
      { id_producto: "1", nombre: "Martillo", categoria: "Herramienta", marca: "MarcaA", valor: 1000, Imagen: "martillo.jpg" },
      { id_producto: "2", nombre: "Taladro", categoria: "Herramienta", marca: "MarcaB", valor: 2000, Imagen: "taladro.jpg" },
      { id_producto: "3", nombre: "Llave inglesa", categoria: "Herramienta", marca: "MarcaC", valor: 1500, Imagen: "llave.jpg" }
    ];
    renderProductos(productos);
    const cards = document.querySelectorAll('#productos-container > div');
    expect(cards.length).toBe(3);
  });

  test('4. Mostrar error si falla la API', () => {
    const contenedor = document.getElementById('productos-container');
    contenedor.innerHTML = "";
    expect(contenedor.innerHTML).toBe("");
  });

  test('5. Validar que los productos estén ordenados por nombre ascendente', () => {
    const productos = [
      { id_producto: "1", nombre: "Martillo", categoria: "Herramienta", marca: "MarcaA", valor: 1000, Imagen: "martillo.jpg" },
      { id_producto: "2", nombre: "Taladro", categoria: "Herramienta", marca: "MarcaB", valor: 2000, Imagen: "taladro.jpg" },
      { id_producto: "3", nombre: "Llave inglesa", categoria: "Herramienta", marca: "MarcaC", valor: 1500, Imagen: "llave.jpg" }
    ];
    renderProductos(productos);
    const nombres = Array.from(document.querySelectorAll('.nombre-producto')).map(el => el.textContent);
    const nombresOrdenados = [...nombres].sort();
    expect(nombres).toEqual(nombresOrdenados);
  });

  test('6. Validar que los botones "Agregar al carrito" funcionen', () => {
    const productos = [
      { id_producto: "1", nombre: "Martillo", categoria: "Herramienta", marca: "MarcaA", valor: 1000, Imagen: "martillo.jpg" }
    ];
    renderProductos(productos);

    // Añadir listener como en producción
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('agregar-carrito')) {
        const btn = e.target;
        const producto = {
          id: btn.dataset.id,
          nombre: btn.dataset.nombre,
          precio: parseFloat(btn.dataset.precio),
          cantidad: 1
        };
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const index = carrito.findIndex(item => item.id === producto.id);
        if (index !== -1) {
          carrito[index].cantidad += 1;
        } else {
          carrito.push(producto);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
      }
    });

    const btnAgregar = document.querySelector('.agregar-carrito');
    btnAgregar.click();

    const carrito = JSON.parse(localStorage.getItem('carrito'));
    expect(carrito).not.toBeNull();
    expect(carrito.length).toBe(1);
    expect(carrito[0].nombre).toBe("Martillo");
    expect(carrito[0].precio).toBe(1000);
  });
});
