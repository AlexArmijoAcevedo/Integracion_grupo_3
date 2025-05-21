import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

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

// Función para mostrar productos
async function cargarProductos() {
  const contenedor = document.getElementById("productos-container");

  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    
    querySnapshot.forEach((doc) => {
      const producto = doc.data();
      const card = `
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <img src="..." class="card-img" alt="Product Image" style="height: 200px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">${producto.descripcion}</p>
              <div class= "d-flex justify-content-between align-item-center">
                <span class="card-price" style="font-size: 1.2rem; font-weight: 700; color:  rgb(0, 33, 56);;">$${producto.precio}</span>
              </div>
              <div class="card-btn-container">
              <button class="btn btn-primary agregar-carrito" 
                        data-nombre="${producto.nombre}" 
                        data-precio="${producto.precio}">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      contenedor.innerHTML += card;
    });

     setTimeout(() => {
      const botones = document.querySelectorAll(".agregar-carrito");
      botones.forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const nombre = btn.getAttribute("data-nombre");
          const precio = parseFloat(btn.getAttribute("data-precio"));
          const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
          carrito.push({ id, nombre, precio });
          localStorage.setItem("carrito", JSON.stringify(carrito));
          alert("Producto agregado al carrito");
        });
      });
    }, 500); 
    
  } catch (error) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML = "<p>Error al cargar los productos.</p>";
  }
}

// Listener de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario autenticado:", user.email);
    cargarProductos();
  } else {
    console.log("Usuario no autenticado");
    // Redirige al login si no está en la página de login
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "/login.html";
    }
  }
});

// Login (si tienes formulario)
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
