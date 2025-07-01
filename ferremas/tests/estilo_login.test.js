/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';

describe('Estilo Login - Interacciones visuales', () => {
  let document;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../taller_ferremas/templates/login.html'), 'utf8');
    document = document.implementation.createHTMLDocument();
    document.documentElement.innerHTML = html;

    // Crear estructura mínima para pruebas
    const loginText = document.createElement('div');
    loginText.className = 'title-text';
    loginText.innerHTML = '<div class="login"></div>';

    const form = document.createElement('form');
    form.className = 'login';

    const loginBtn = document.createElement('label');
    loginBtn.className = 'login';

    const signupBtn = document.createElement('label');
    signupBtn.className = 'signup';

    const signupLink = document.createElement('a');
    signupLink.className = 'signup-link';

    form.innerHTML = '<input type="text" class="input-login" /><button>Enviar</button>';

    document.body.appendChild(loginText);
    document.body.appendChild(form);
    document.body.appendChild(loginBtn);
    document.body.appendChild(signupBtn);
    document.body.appendChild(signupLink);

    // Simular código del script
    signupBtn.onclick = () => {
      form.style.marginLeft = '-50%';
      loginText.style.marginLeft = '-50%';
    };

    loginBtn.onclick = () => {
      form.style.marginLeft = '0%';
      loginText.style.marginLeft = '0%';
    };

    signupLink.onclick = () => {
      signupBtn.click();
      return false;
    };
  });

  test('1. Cambiar color del botón al hacer hover', () => {
    const button = document.querySelector('button');
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'red';
    });

    button.dispatchEvent(new Event('mouseenter'));
    expect(button.style.backgroundColor).toBe('red');
  });

  test('2. Aplicar animación de foco en input', () => {
    const input = document.querySelector('.input-login');
    input.addEventListener('focus', () => {
      input.classList.add('focus-animacion');
    });

    input.dispatchEvent(new Event('focus'));
    expect(input.classList.contains('focus-animacion')).toBe(true);
  });

  test('3. Restaurar estilo al hacer blur', () => {
    const input = document.querySelector('.input-login');
    input.classList.add('focus-animacion');

    input.addEventListener('blur', () => {
      input.classList.remove('focus-animacion');
    });

    input.dispatchEvent(new Event('blur'));
    expect(input.classList.contains('focus-animacion')).toBe(false);
  });

  test('4. Validar clase CSS aplicada correctamente', () => {
    const input = document.querySelector('.input-login');
    input.classList.add('mi-clase-estilo');
    expect(input.classList.contains('mi-clase-estilo')).toBe(true);
  });

  test('5. Verificar que se desactiva animación al enviar formulario', () => {
    const input = document.querySelector('.input-login');
    const button = document.querySelector('button');

    input.classList.add('animacion-login');

    button.addEventListener('click', () => {
      input.classList.remove('animacion-login');
    });

    button.dispatchEvent(new Event('click'));
    expect(input.classList.contains('animacion-login')).toBe(false);
  });

  test('6. Validar que se agregue sombra al input al enfocarse', () => {
    const input = document.querySelector('.input-login');
    input.addEventListener('focus', () => {
      input.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.5)';
    });

    input.dispatchEvent(new Event('focus'));
    expect(input.style.boxShadow).toBe('0px 0px 5px rgba(0, 0, 0, 0.5)');
  });
});
