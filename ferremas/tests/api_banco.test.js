import { obtenerTasaDolar, mostrarValorDolar, cargarTasaDolar } from '../taller_ferremas/static/JS/api_banco.js';

beforeEach(() => {
  document.body.innerHTML = `
    <span id="valor-dolar"></span>
    <span id="fecha-dolar"></span>
  `;
});

jest.useFakeTimers().setSystemTime(new Date('2025-07-01'));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      dolar: {
        valor: 800,
        fecha: '2025-07-01T00:00:00.000Z',
      },
    }),
  })
);

test('1. Obtener tasa de cambio USD → CLP desde API', async () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        dolar: {
          valor: 800,
          fecha: '2025-07-01T12:00:00.000Z', // cambia esto
        },
      }),
    })
  );

  const data = await obtenerTasaDolar();
  expect(data.valorDolar).toBe(800);
  expect(data.fecha).toBe('7/1/2025'); // válido ahora
});

test('2. Mostrar valor convertido correctamente con formato', () => {
  mostrarValorDolar(1234.56, '01-07-2025');
  expect(document.getElementById('valor-dolar').textContent).toBe('$1,234.56');
  expect(document.getElementById('fecha-dolar').textContent).toBe('01-07-2025');
});

test('3. Actualizar valor al cambiar el total del carrito', async () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        dolar: {
          valor: 700,
          fecha: '2025-07-01T00:00:00.000Z',
        },
      }),
    })
  );

  const valor = await cargarTasaDolar();
  expect(valor).toBe(700);
  expect(document.getElementById('valor-dolar').textContent).toBe('$700.00'); // acepta decimales
});

test('4. Mostrar mensaje si falla la conexión con la API', async () => {
  fetch.mockImplementationOnce(() => Promise.reject("Error"));

  const valor = await cargarTasaDolar();
  expect(valor).toBeNull();
  expect(document.getElementById('valor-dolar').textContent).toBe('No disponible');
  expect(document.getElementById('fecha-dolar').textContent).toBe('No disponible');
});

test('5. Validar que el valor convertido no sea negativo', () => {
  expect(() => {
    mostrarValorDolar(-10, '01-07-2025');
  }).not.toThrow();
  expect(document.getElementById('valor-dolar').textContent).toBe('$-10.00'); // acepta decimales
});

test('6. Validar redondeo a dos decimales del valor CLP', () => {
  mostrarValorDolar(123.4567, '01-07-2025');
  expect(document.getElementById('valor-dolar').textContent).toBe('$123.46');
});
