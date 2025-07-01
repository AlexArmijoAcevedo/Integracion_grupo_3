// pago.js

function inicializarFormularioPago() {
  const form = document.getElementById("form-pago");
  const btnPagar = document.getElementById("btn-pagar");
  const mensaje = document.getElementById("mensaje");

  if (!form || !btnPagar || !mensaje) return;

  // Formatear número de tarjeta
  const numeroInput = document.getElementById('numero');
  if (numeroInput) {
    numeroInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 16) value = value.slice(0, 16);
      e.target.value = value.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const numero = document.getElementById("numero").value.replace(/\s/g, '');
    const fecha = document.getElementById("fecha").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    let errores = false;
    mensaje.textContent = "";

    if (nombre === "") {
      document.getElementById("error-nombre").textContent = "El nombre es obligatorio.";
      errores = true;
    } else {
      document.getElementById("error-nombre").textContent = "";
    }

    if (numero.length !== 16 || !/^\d{16}$/.test(numero)) {
      document.getElementById("error-numero").textContent = "La tarjeta debe tener 16 dígitos numéricos.";
      errores = true;
    } else {
      document.getElementById("error-numero").textContent = "";
    }

    if (fecha === "") {
      document.getElementById("error-fecha").textContent = "La fecha de expiración es obligatoria.";
      errores = true;
    } else {
      document.getElementById("error-fecha").textContent = "";
    }

    if (!/^\d{3}$/.test(cvv)) {
      document.getElementById("error-cvv").textContent = "El CVV debe tener exactamente 3 dígitos.";
      errores = true;
    } else {
      document.getElementById("error-cvv").textContent = "";
    }

    if (errores) {
      mensaje.textContent = "El formulario contiene errores. Por favor corrígelos antes de enviar.";
      return;
    }

    btnPagar.disabled = true;
    btnPagar.textContent = "Enviando...";

    try {
      const response = await fetch("/simular-webpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, numero, fecha, cvv }),
      });

      const data = await response.json();

      if (response.ok && data.status === "aceptado") {
        mensaje.textContent = "Pago exitoso. Gracias por tu compra.";
      } else {
        mensaje.textContent = "Transacción rechazada por WebPay.";
      }
    } catch (error) {
      mensaje.textContent = "Error al procesar el pago.";
    }

    btnPagar.disabled = false;
    btnPagar.textContent = "Pagar";
  });
}

// Solo ejecuta en entorno real de navegador
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", inicializarFormularioPago);
}

module.exports = { inicializarFormularioPago };
