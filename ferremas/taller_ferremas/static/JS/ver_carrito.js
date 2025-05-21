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

  console.log("Carrito cargado:", carrito);

  // Agrupar productos por ID
  const productosAgrupados = {};
  carrito.forEach(producto => {
    if (productosAgrupados[producto.id]) {
      productosAgrupados[producto.id].cantidad += 1;
    } else {
      productosAgrupados[producto.id] = { ...producto, cantidad: 1 };
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
          <button class="btn btn-sm btn-outline-secondary me-1 btn-disminuir" data-id="${producto.id}">−</button>
          <span id="cantidad-${producto.id}" class="px-2">${producto.cantidad}</span>
          <button class="btn btn-sm btn-outline-secondary ms-1 btn-aumentar" data-id="${producto.id}">+</button>
        </div>
      </td>
      <td id="subtotal-${producto.id}">$${subtotal}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.id}">Eliminar</button>
      </td>
    `;

    carritoContainer.appendChild(row);
  });

  totalSpan.textContent = `$${total}`;

  // Asignar eventos a botones
  document.querySelectorAll(".btn-disminuir").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      actualizarCantidad(id, -1);
    });
  });

  document.querySelectorAll(".btn-aumentar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      actualizarCantidad(id, 1);
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      eliminarProducto(id);
    });
  });
}

function actualizarCantidad(id, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const productosFiltrados = carrito.filter(p => p.id === id);
  let cantidadActual = productosFiltrados.length;

  if (cambio === -1) {
    if (cantidadActual > 1) {
      let encontrado = false;
      carrito = carrito.filter(p => {
        if (!encontrado && p.id === id) {
          encontrado = true; 
          return false; // elimina uno
        }
        return true;
      });
    }
    // Si es 1 o menos no hace nada para no bajar de 1
  } else if (cambio === 1) {
    carrito.push(productosFiltrados[0]);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function eliminarProducto(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}
