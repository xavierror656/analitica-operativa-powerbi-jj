const lenguajes = { powerquery: 'Power Query · M', dax: 'DAX', jsx: 'React · JSX', tsx: 'React · TSX', javascript: 'JavaScript', js: 'JavaScript', text: 'Texto', plaintext: 'Texto' };

/** Mejora también los bloques Markdown; conserva el texto original para copiar. */
export function conectarCodigo({ document: doc, window: win }) {
  for (const pre of doc.querySelectorAll('pre')) {
    const code = pre.querySelector('code');
    if (!code || pre.closest('.codigo-bloque, aside.notes')) continue;
    const texto = code.textContent;
    const lenguaje = pre.dataset.language || 'text';
    const bloque = doc.createElement('div');
    bloque.className = 'codigo-bloque';
    const cabecera = doc.createElement('div');
    cabecera.className = 'codigo-cabecera';
    const titulo = doc.createElement('span');
    titulo.textContent = lenguajes[lenguaje] || lenguaje.charAt(0).toUpperCase() + lenguaje.slice(1);
    const boton = doc.createElement('button');
    boton.type = 'button';
    boton.className = 'codigo-copiar';
    boton.textContent = 'Copiar código';
    boton.setAttribute('aria-label', `Copiar código · ${titulo.textContent}`);
    const estado = doc.createElement('span');
    estado.className = 'codigo-estado';
    estado.setAttribute('role', 'status');
    cabecera.append(titulo, boton);
    pre.before(bloque);
    bloque.append(cabecera, pre, estado);
    pre.tabIndex = 0;
    pre.setAttribute('aria-label', `Código · ${titulo.textContent}`);
    // Las flechas desplazan el código; Espacio/Enter activan el botón sin cambiar de slide.
    bloque.addEventListener('keydown', event => event.stopPropagation());
    let timer;
    boton.addEventListener('click', async () => {
      win.clearTimeout(timer);
      boton.disabled = true;
      estado.textContent = '';
      bloque.classList.remove('codigo-error');
      try {
        await win.navigator.clipboard.writeText(texto);
        boton.textContent = '✓ Copiado';
        estado.textContent = 'Código copiado al portapapeles.';
      } catch {
        // Si el navegador bloquea el portapapeles, deja el código seleccionado.
        pre.focus({ preventScroll: true });
        const rango = doc.createRange();
        rango.selectNodeContents(code);
        const seleccion = win.getSelection();
        seleccion.removeAllRanges();
        seleccion.addRange(rango);
        boton.textContent = 'Reintentar copia';
        estado.textContent = 'No se pudo copiar. Código seleccionado: pulsa Ctrl+C o ⌘C.';
        bloque.classList.add('codigo-error');
      } finally {
        boton.disabled = false;
        timer = win.setTimeout(() => {
          boton.textContent = 'Copiar código';
          estado.textContent = '';
          bloque.classList.remove('codigo-error');
        }, 5000);
      }
    });
  }
}
