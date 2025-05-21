// ver_carrito.js
document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();

  document.getElementById("btn-enviar").addEventListener("click", () => {
    alert("Funcionalidad de envío pendiente...");
  });
});

function mostrarCarrito() {
  const carritoContainer = document.getElementById("carrito-container");
  const totalSpan = document.getElementById("total");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Agrupar productos por ID
  const productosAgrupados = {};
  carrito.forEach(producto => {
    if (productosAgrupados[producto.id]) {
      productosAgrupados[producto.id].cantidad += 1;
    } else {
      productosAgrupados[producto.id] = { ...producto };
    }
  });

  carritoContainer.innerHTML = "";
  let total = 0;

  Object.values(productosAgrupados).forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${producto.nombre}</td>
      <td>$${producto.precio}</td>
      <td>
        <div class="d-flex align-items-center justify-content-center">
          <button class="btn btn-sm btn-outline-secondary me-1" onclick="actualizarCantidad(${producto.id}, -1)">−</button>
          <span id="cantidad-${producto.id}" class="px-2">${producto.cantidad}</span>
          <button class="btn btn-sm btn-outline-secondary ms-1" onclick="actualizarCantidad(${producto.id}, 1)">+</button>
        </div>
      </td>
      <td id="subtotal-${producto.id}">$${subtotal}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
      </td>
    `;

    carritoContainer.appendChild(row);
  });

  totalSpan.textContent = `$${total}`;
}

// Aumentar o disminuir cantidad
window.actualizarCantidad = function (id, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const index = carrito.findIndex(p => p.id === id);
  if (index === -1) return;

  // Agrupar productos iguales
  let productosFiltrados = carrito.filter(p => p.id === id);
  let cantidadActual = productosFiltrados.length;

  if (cambio === -1 && cantidadActual <= 1) {
    carrito = carrito.filter(p => p.id !== id);
  } else if (cambio === -1) {
    let encontrado = false;
    carrito = carrito.filter(p => {
      if (!encontrado && p.id === id) {
        encontrado = true;
        return false; // elimina uno
      }
      return true;
    });
  } else if (cambio === 1) {
    carrito.push(productosFiltrados[0]); // añade otro igual
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

// Eliminar todos los productos de ese tipo por nombre
window.eliminarProducto = function (nombre) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Elimina todos los productos con ese nombre
  carrito = carrito.filter(p => p.nombre !== nombre);

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
};

