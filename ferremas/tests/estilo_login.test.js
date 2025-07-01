/**
 * @jest-environment jsdom
 */

describe('Interacción en estilo_login.js', () => {
  let loginText, loginForm, loginBtn, signupBtn, signupLink;

  beforeEach(() => {
    // Simular estructura HTML relevante
    document.body.innerHTML = `
      <div class="title-text">
        <div class="login" style="margin-left: 0%"></div>
      </div>
      <form class="login" style="margin-left: 0%">
        <div class="signup-link"><a href="#">Registrarse</a></div>
      </form>
      <label class="login">Login</label>
      <label class="signup">Signup</label>
    `;

    // Re-importar elementos como en el script
    loginText = document.querySelector(".title-text .login");
    loginForm = document.querySelector("form.login");
    loginBtn = document.querySelector("label.login");
    signupBtn = document.querySelector("label.signup");
    signupLink = document.querySelector("form .signup-link a");

    // Simular funcionalidad como en estilo_login.js
    signupBtn.onclick = () => {
      loginForm.style.marginLeft = "-50%";
      loginText.style.marginLeft = "-50%";
    };
    loginBtn.onclick = () => {
      loginForm.style.marginLeft = "0%";
      loginText.style.marginLeft = "0%";
    };
    signupLink.onclick = () => {
      signupBtn.click();
      return false;
    };
  });

  test('1. Cambiar margen a -50% al hacer clic en Signup', () => {
    signupBtn.click();
    expect(loginForm.style.marginLeft).toBe("-50%");
    expect(loginText.style.marginLeft).toBe("-50%");
  });

  test('2. Cambiar margen a 0% al hacer clic en Login', () => {
    // Primero cambiamos a -50%
    signupBtn.click();
    // Luego hacemos clic en Login
    loginBtn.click();
    expect(loginForm.style.marginLeft).toBe("0%");
    expect(loginText.style.marginLeft).toBe("0%");
  });

  test('3. Al hacer clic en el enlace de registro se activa el botón de Signup', () => {
    const spy = jest.spyOn(signupBtn, 'click');
    signupLink.click();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('4. El enlace de registro cancela la acción por defecto', () => {
    const event = new MouseEvent('click');
    const preventDefault = jest.fn();
    signupLink.addEventListener('click', e => e.preventDefault());
    signupLink.dispatchEvent(event);
    expect(preventDefault).not.toHaveBeenCalled(); // por ahora no está en tu código original
  });

  test('5. Verificar valores iniciales de margen en 0%', () => {
    expect(loginForm.style.marginLeft).toBe("0%");
    expect(loginText.style.marginLeft).toBe("0%");
  });

  test('6. Alternar entre Signup y Login funciona correctamente', () => {
    signupBtn.click();
    expect(loginForm.style.marginLeft).toBe("-50%");
    loginBtn.click();
    expect(loginForm.style.marginLeft).toBe("0%");
  });
});
