function renderProductos(productos) {
  productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = ""; // Limpia el contenedor antes de renderizar

  productos.forEach(producto => {
    const card = `
      <div class="col-md-4">
        <div class="card mb-4 shadow-sm">
          <img src="/static/IMG/${producto.Imagen}" class="card-img" alt="Imagen del producto" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title nombre-producto">${producto.nombre}</h5>
            <p class="card-text">${producto.categoria} - ${producto.marca}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="card-price" style="font-size: 1.2rem; font-weight: 700; color: rgb(0, 33, 56);">
                $${producto.valor}
              </span>
            </div>
            <div class="card-btn-container mt-3 d-flex justify-content-around">
              <button 
                class="btn btn-outline-primary ver-detalle" 
                data-id="${producto.id_producto}" 
                data-nombre="${producto.nombre}" 
                data-marca="${producto.marca}"
                data-valor="${producto.valor}"
                data-categoria="${producto.categoria}">
                Ver más
              </button>
              <button 
                class="btn btn-success agregar-carrito"
                data-id="${producto.id_producto}"
                data-nombre="${producto.nombre}" 
                data-precio="${producto.valor}">
                <i class="bi bi-cart-plus"></i> Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    contenedor.innerHTML += card;
  });
}

module.exports = { renderProductos };
