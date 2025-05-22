document.addEventListener('DOMContentLoaded', () => {
  fetch("https://api.allorigins.win/raw?url=https://mindicador.cl/api")
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then(data => {
      const valorDolar = data.dolar.valor;
      const fecha = new Date(data.dolar.fecha).toLocaleDateString('es-CL');
      document.getElementById("valor-dolar").textContent = `$${valorDolar.toLocaleString('es-CL')}`;
      document.getElementById("fecha-dolar").textContent = fecha;
    })
    .catch(() => {
      document.getElementById("valor-dolar").textContent = "No disponible";
      document.getElementById("fecha-dolar").textContent = "No disponible";
    });
});
