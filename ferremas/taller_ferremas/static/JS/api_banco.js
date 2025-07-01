// api_banco.js

export async function obtenerTasaDolar() {
  try {
    const response = await fetch("https://api.allorigins.win/raw?url=https://mindicador.cl/api");
    if (!response.ok) throw new Error("Error al obtener los datos de la API");
    const data = await response.json();

    const valorDolar = data.dolar.valor;
    const fechaObj = new Date(data.dolar.fecha);
    // Formato M/D/YYYY
    const fecha = `${fechaObj.getMonth() + 1}/${fechaObj.getDate()}/${fechaObj.getFullYear()}`;

    return { valorDolar, fecha };
  } catch (error) {
    return null;
  }
}

export function mostrarValorDolar(valorDolar, fecha) {
  // Formatear valorDolar con coma miles y dos decimales con punto decimal
  const valorFormateado = `$${valorDolar.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  document.getElementById("valor-dolar").textContent = valorFormateado;
  document.getElementById("fecha-dolar").textContent = fecha;
}

export async function cargarTasaDolar() {
  const datos = await obtenerTasaDolar();
  if (datos) {
    mostrarValorDolar(datos.valorDolar, datos.fecha);
    return datos.valorDolar;
  } else {
    document.getElementById("valor-dolar").textContent = "No disponible";
    document.getElementById("fecha-dolar").textContent = "No disponible";
    return null;
  }
}

// Ejecutar automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarTasaDolar();
});
