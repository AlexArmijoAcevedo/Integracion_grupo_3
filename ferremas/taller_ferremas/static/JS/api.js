const apiKey = "9b36930e0765b5b17dcd9564b559da11";

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log(`Tu ubicación: Latitud ${lat}, Longitud ${lon}`);

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          const ciudad = data.name;
          const temperatura = data.main.temp;

          console.log(`Estás en: ${ciudad}`);
          console.log(`Temperatura actual: ${temperatura} °C`);

          document.getElementById("ciudad").textContent = ciudad;
          document.getElementById("temp").textContent = `${temperatura} °C`;
        })
        .catch(error => console.error("Error al obtener clima:", error));
    },
    error => {
      console.error("Permiso denegado o error al obtener ubicación:", error);
    }
  );
} else {
  console.log("El navegador no admite geolocalización.");
}
