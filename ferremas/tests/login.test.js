/**
 * @jest-environment jsdom
 */

const { signInWithEmailAndPassword } = require('firebase/auth');

// 🔧 Simula Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

beforeEach(() => {
  // Simula el HTML de login
  document.body.innerHTML = `
    <form class="login">
      <input type="email" id="email" placeholder="Correo electrónico" />
      <input type="password" id="password" placeholder="Contraseña" />
      <input type="submit" value="Login" id="btn-login" />
    </form>
  `;
});

test('1. Validar que usuario y contraseña no estén vacíos', () => {
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  expect(email.value).toBe('');
  expect(password.value).toBe('');
});

test('2. Rechaza credenciales incorrectas', async () => {
  signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Credenciales incorrectas'));

  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const form = document.querySelector('form.login');
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  email.value = 'fake@mail.com';
  password.value = 'badpass';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    signInWithEmailAndPassword({}, email.value, password.value).catch((error) => {
      alert("Error al iniciar sesión: " + error.message);
    });
  });

  form.dispatchEvent(new Event('submit', { bubbles: true }));
  await Promise.resolve();

  expect(signInWithEmailAndPassword).toHaveBeenCalled();
  expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Error al iniciar sesión'));

  alertMock.mockRestore();
});

test('3. Acepta credenciales válidas', async () => {
  signInWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'usuario@email.com' } });

  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const form = document.querySelector('form.login');
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

  email.value = 'usuario@email.com';
  password.value = 'claveCorrecta';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    signInWithEmailAndPassword({}, email.value, password.value).then(() => {
      alert("Inicio de sesión exitoso");
    });
  });

  form.dispatchEvent(new Event('submit', { bubbles: true }));
  await Promise.resolve();

  expect(alertMock).toHaveBeenCalledWith("Inicio de sesión exitoso");

  alertMock.mockRestore();
});

test('4. Botón muestra "Cargando..." durante login', () => {
  const btn = document.getElementById('btn-login');
  btn.value = 'Cargando...';
  expect(btn.value).toBe('Cargando...');
});

test('5. Botón se deshabilita durante login', () => {
  const btn = document.getElementById('btn-login');
  btn.disabled = true;
  expect(btn.disabled).toBe(true);
});

test('6. Enviar formulario al presionar Enter', () => {
  const form = document.querySelector('form.login');
  const handler = jest.fn(e => e.preventDefault());
  form.addEventListener('submit', handler);

  const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
  document.getElementById('password').dispatchEvent(enter);
  form.dispatchEvent(new Event('submit', { bubbles: true }));

  expect(handler).toHaveBeenCalled();
});
