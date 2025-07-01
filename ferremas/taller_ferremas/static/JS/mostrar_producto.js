import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Función para renderizar productos, exportada para pruebas unitarias
export function renderProductos(productos) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = ""; // limpia antes

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

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC6oBATkiU7X2FMd8_FZrBJ6phFe5Too-I",
  authDomain: "ferremas-cb091.firebaseapp.com",
  projectId: "ferremas-cb091",
  storageBucket: "ferremas-cb091.appspot.com",
  messagingSenderId: "946559441320",
  appId: "1:946559441320:web:b2b5b6af992b701a28e59d",
  measurementId: "G-LJ6RRJV01P"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  
const auth = getAuth(app);

// Carga productos desde Firestore y renderiza
export async function cargarProductos() {
  const contenedor = document.getElementById("productos-container");

  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const productos = [];

    querySnapshot.forEach(doc => {
      productos.push(doc.data());
    });

    renderProductos(productos);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML = "<p>Error al cargar los productos.</p>";
  }
}

// Manejo de autenticación y carga productos si está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario autenticado:", user.email);
    cargarProductos();
  } else {
    console.log("Usuario no autenticado");
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "/login.html";
    }
  }
});

// Login
const form = document.getElementById("login-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("login-error");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      errorDiv.textContent = "Correo o contraseña incorrectos.";
    }
  });
}

// Mostrar detalle producto en modal
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('ver-detalle')) {
    const nombre = e.target.dataset.nombre;
    const marca = e.target.dataset.marca;
    const valor = e.target.dataset.valor;
    const categoria = e.target.dataset.categoria;

    const contenido = `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Marca:</strong> ${marca}</p>
      <p><strong>Precio:</strong> $${valor}</p>
      <p><strong>Categoría:</strong> ${categoria}</p>
    `;

    document.getElementById('detalleContenido').innerHTML = contenido;
    const modal = new bootstrap.Modal(document.getElementById('detalleModal'));
    modal.show();
  }
});

// Agregar al carrito con localStorage
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
    alert(`${producto.nombre} agregado al carrito`);
  }
});
