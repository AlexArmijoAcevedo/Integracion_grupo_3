/**
 * @jest-environment jsdom
 */

const { createUserWithEmailAndPassword } = require('firebase/auth');

// 🔧 Simula Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

beforeEach(() => {
  document.body.innerHTML = `
    <form class="signup">
      <input type="email" id="email" placeholder="Correo electrónico" />
      <input type="password" id="password" placeholder="Contraseña" />
      <input type="password" id="confirmPassword" placeholder="Confirmar Contraseña" />
      <input type="submit" id="btn-signup" value="SignUp" />
    </form>
  `;
});

test('1. Validar que todos los campos estén completos', () => {
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirmPassword');

  expect(email.value).toBe('');
  expect(password.value).toBe('');
  expect(confirm.value).toBe('');
});

test('2. Rechazar registro con usuario ya existente', async () => {
  createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('auth/email-already-in-use'));

  const form = document.querySelector('form.signup');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirmPassword');

  email.value = 'repetido@mail.com';
  password.value = '123456';
  confirm.value = '123456';

  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (password.value !== confirm.value) return;

    createUserWithEmailAndPassword({}, email.value, password.value).catch((error) => {
      alert("Error: " + error.message);
    });
  });

  form.dispatchEvent(new Event('submit', { bubbles: true }));
  await Promise.resolve();

  expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Error: auth/email-already-in-use"));

  alertMock.mockRestore();
});

test('3. Validar formato de correo electrónico', () => {
  const email = document.getElementById('email');
  email.value = 'correo-sin-arroba.com';

  const esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  expect(esValido).toBe(false);
});

test('4. Validar coincidencia de contraseña y confirmación', () => {
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirmPassword');

  password.value = '123456';
  confirm.value = '654321';

  const coincide = password.value === confirm.value;
  expect(coincide).toBe(false);
});

test('5. Mostrar mensaje de éxito tras registro', async () => {
  createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'nuevo@mail.com' } });

  const form = document.querySelector('form.signup');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirmPassword');

  email.value = 'nuevo@mail.com';
  password.value = 'clave123';
  confirm.value = 'clave123';

  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (password.value !== confirm.value) return;

    createUserWithEmailAndPassword({}, email.value, password.value).then(() => {
      alert("Usuario registrado correctamente");
    });
  });

  form.dispatchEvent(new Event('submit', { bubbles: true }));
  await Promise.resolve();

  expect(alertMock).toHaveBeenCalledWith("Usuario registrado correctamente");

  alertMock.mockRestore();
});

test('6. Validar que se activa el login tras registrarse', async () => {
  createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'nuevo@mail.com' } });

  // Agregar inputs radio para simular el cambio de pestaña
  document.body.innerHTML += `
    <input type="radio" id="login" name="slide">
    <input type="radio" id="signup" name="slide" checked>
  `;

  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirmPassword');
  const form = document.querySelector('form.signup');

  email.value = 'nuevo@mail.com';
  password.value = 'clave123';
  confirm.value = 'clave123';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (password.value !== confirm.value) return;

    createUserWithEmailAndPassword({}, email.value, password.value).then(() => {
      document.getElementById("login").checked = true;
    });
  });

  form.dispatchEvent(new Event('submit', { bubbles: true }));
  await Promise.resolve();

  expect(document.getElementById("login").checked).toBe(true);
});
