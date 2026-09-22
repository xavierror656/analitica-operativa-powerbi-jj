/** Reproduce únicamente la diapositiva visible; PDF y movimiento reducido usan SVG. */
export function conectarAnimaciones({ document: doc, window: win, cargar }) {
  const params = new URLSearchParams(win.location.search);
  if (params.has('print-pdf') || params.get('view') === 'print') return () => {};
  const figuras = [...doc.querySelectorAll('[data-lottie]')];
  if (!figuras.length) return () => {};
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
  const estados = figuras.map(figura => ({ figura, boton: figura.querySelector('button'), player: null, pending: false, failed: false, visto: false, listo: false }));
  let imprimiendo = false, cerrado = false, biblioteca;
  const puede = e => !cerrado && !imprimiendo && !reduced.matches && !doc.hidden && e.figura.closest('section')?.classList.contains('present') && !doc.querySelector('.reveal.overview, .reveal.paused');
  function parar(e, poster = false) {
    e.player?.pause(); e.player?.freeze();
    e.boton.textContent = 'Reproducir animación';
    if (poster) e.figura.removeAttribute('data-playing');
  }
  function reproducir(e, reiniciar = false) {
    if (!puede(e) || !e.listo) return;
    e.player.unfreeze();
    if (reiniciar) e.player.setFrame(0);
    e.figura.setAttribute('data-playing', '');
    e.player.play(); e.visto = true;
    e.boton.textContent = 'Pausar animación';
  }
  async function preparar(e) {
    if (e.pending || e.failed || e.player) return;
    e.pending = true;
    try {
      biblioteca ??= cargar();
      const Player = await biblioteca;
      if (cerrado || !puede(e)) return;
      e.player = new Player({ canvas: e.figura.querySelector('canvas'), src: e.figura.dataset.src, autoplay: false, loop: false, renderConfig: { devicePixelRatio: 1, autoResize: false, freezeOnOffscreen: false } });
      const fallo = () => { e.failed = true; e.listo = false; parar(e, true); e.boton.hidden = true; e.player?.destroy(); e.player = null; };
      e.player.addEventListener('loadError', fallo);
      e.player.addEventListener('renderError', fallo);
      e.player.addEventListener('load', () => { e.listo = true; e.boton.hidden = reduced.matches; reproducir(e); });
      e.player.addEventListener('complete', () => { parar(e); e.boton.textContent = 'Repetir animación'; });
    } catch { e.failed = true; e.boton.hidden = true; }
    finally { e.pending = false; }
  }
  function actualizar() {
    for (const e of estados) {
      e.boton.hidden = reduced.matches || !e.listo || e.failed;
      if (!puede(e)) { parar(e, reduced.matches || imprimiendo); continue; }
      if (!e.player) void preparar(e);
      else if (!e.visto) reproducir(e);
    }
  }
  for (const e of estados) {
    e.click = () => {
      if (e.player?.isPlaying) parar(e);
      else reproducir(e, e.player?.currentFrame >= (e.player?.totalFrames ?? 1) - 1);
    };
    e.boton.addEventListener('click', e.click);
    e.keydown = event => { if (event.key === ' ' || event.key === 'Enter') event.stopPropagation(); };
    e.boton.addEventListener('keydown', e.keydown);
  }
  const observer = new win.MutationObserver(actualizar);
  const root = doc.querySelector('.reveal');
  if (root) observer.observe(root, { attributes: true, attributeFilter: ['class'], subtree: true });
  const antes = () => { imprimiendo = true; actualizar(); };
  const despues = () => { imprimiendo = false; actualizar(); };
  const limpiar = () => {
    cerrado = true; observer.disconnect();
    reduced.removeEventListener('change', actualizar);
    doc.removeEventListener('visibilitychange', actualizar);
    win.removeEventListener('beforeprint', antes); win.removeEventListener('afterprint', despues);
    win.removeEventListener('pagehide', ocultar); win.removeEventListener('pageshow', actualizar);
    for (const e of estados) { e.boton.removeEventListener('click', e.click); e.boton.removeEventListener('keydown', e.keydown); e.figura.removeAttribute('data-playing'); e.boton.hidden = true; e.player?.destroy(); }
  };
  const ocultar = event => { if (event.persisted) estados.forEach(e => parar(e, true)); else limpiar(); };
  reduced.addEventListener('change', actualizar);
  doc.addEventListener('visibilitychange', actualizar);
  win.addEventListener('beforeprint', antes); win.addEventListener('afterprint', despues);
  win.addEventListener('pagehide', ocultar); win.addEventListener('pageshow', actualizar);
  actualizar();
  return limpiar;
}
