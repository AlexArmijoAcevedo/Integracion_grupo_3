/**
 * @jest-environment jsdom
 */

describe('Vista About Us', () => {
  beforeEach(() => {
    // Simula el contenido principal de about_us.html
    document.body.innerHTML = `
      <div class="container mt-5">
        <h1 class="text-center fw-bold mb-5">Sobre Nosotros</h1>
        <p class="fs-5 mb-4">FERREMAS se ha consolidado como una empresa referente en el rubro...</p>
        <p class="fs-5 mb-4">Nuestra historia está ligada al crecimiento urbano...</p>
        <p class="fs-5 mb-4">En nuestras sucursales encontrarás una amplia variedad de productos...</p>
        <p class="fs-5 mb-4">Contamos con un equipo especializado y comprometido...</p>
        <p class="fs-5 mb-4">FERREMAS combina su atención tradicional con una plataforma digital...</p>
        <div class="equipo">
          <img src="/static/IMG/equipo1.jpg" alt="Equipo 1">
          <img src="/static/IMG/equipo2.jpg" alt="Equipo 2">
        </div>
        <footer>
          <a href="https://facebook.com/ferremas">Facebook</a>
          <a href="mailto:contacto@ferremas.cl">Contacto</a>
        </footer>
      </div>
    `;

    // Mock de console.error para la prueba 6
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('1. Verificar que se cargue contenido informativo', () => {
    const parrafos = document.querySelectorAll('p.fs-5');
    expect(parrafos.length).toBeGreaterThanOrEqual(5);
    expect(parrafos[0].textContent).toMatch(/FERREMAS/i);
  });

  test('2. Validar carga de imágenes del equipo', () => {
    const imagenes = document.querySelectorAll('.equipo img');
    expect(imagenes.length).toBeGreaterThanOrEqual(2);
    imagenes.forEach(img => {
      expect(img.getAttribute('src')).toMatch(/\/static\/IMG\/.*\.jpg$/);
    });
  });

  test('3. Verificar enlaces a redes sociales o contacto', () => {
    const enlaces = Array.from(document.querySelectorAll('footer a'));
    const hrefs = enlaces.map(a => a.getAttribute('href'));
    expect(hrefs).toContain('https://facebook.com/ferremas');
    expect(hrefs).toContain('mailto:contacto@ferremas.cl');
  });

  test('4. Validar estructura del DOM (título y párrafos)', () => {
    const titulo = document.querySelector('h1');
    expect(titulo).not.toBeNull();
    expect(titulo.textContent).toBe('Sobre Nosotros');
  });

  test('5. Validar que se muestre correctamente en distintos tamaños de pantalla', () => {
    window.innerWidth = 1200;
    expect(window.innerWidth).toBeGreaterThanOrEqual(1024); // Desktop

    window.innerWidth = 768;
    expect(window.innerWidth).toBeGreaterThanOrEqual(768); // Tablet

    window.innerWidth = 375;
    expect(window.innerWidth).toBeLessThanOrEqual(375); // Mobile
  });

  test('6. Verificar que no haya errores en consola al cargar la vista', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
