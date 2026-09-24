/** Avance local por ruta. Nunca se lee ni escribe desde la vista de PDF. */
export function conectarAvance(deck, { pathname, hash = '', pdf = false, storage, informar = () => {} }) {
  if (pdf) return;
  const clave = 'powerbi:avance:v1:' + (pathname.replace(/\/+$/, '') || '/');
  let disponible = true;
  let listo = false;

  function guardar() {
    if (!listo || !disponible) return;
    try {
      const { h, v = 0 } = deck.getIndices();
      storage().setItem(clave, JSON.stringify({ version: 1, h, v }));
      storage().setItem('powerbi:ultima:v1', JSON.stringify({ version: 1, pathname, h, v }));
      informar('Avance guardado en este navegador');
    } catch {
      disponible = false;
      informar('El navegador no permite guardar el avance');
    }
  }

  deck.on('ready', () => {
    let retomado = false;
    try {
      // Un enlace explícito (#/…) tiene prioridad sobre el avance local.
      if (!hash) {
        const raw = storage().getItem(clave);
        let saved;
        try { saved = raw ? JSON.parse(raw) : null; } catch { saved = null; }
        if (saved?.version === 1 && Number.isInteger(saved.h) && saved.h >= 0 &&
            Number.isInteger(saved.v) && saved.v >= 0 && deck.getSlide(saved.h, saved.v)) {
          deck.slide(saved.h, saved.v);
          retomado = saved.h > 0 || saved.v > 0;
        }
      }
    } catch {
      disponible = false;
      informar('El navegador no permite guardar el avance');
    }
    listo = true;
    guardar();
    if (retomado && disponible) informar(`Retomaste la diapositiva ${deck.getIndices().h + 1}`);
  });
  deck.on('slidechanged', guardar);
}
