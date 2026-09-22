/** Mantiene los recursos disponibles sin reservar espacio en la presentación. */
export function conectarBarraAutooculta({ document: doc, window: win, pdf = false, demora = 2500 }) {
  if (pdf) return () => {};
  const barra = doc.querySelector('.deck-toolbar');
  if (!barra) return () => {};
  const root = doc.documentElement;
  let timer, dentro = barra.matches(':hover'), teclado = true;
  const cancelar = () => win.clearTimeout(timer);
  const programar = () => {
    cancelar();
    timer = win.setTimeout(() => {
      if (!dentro && !(teclado && barra.contains(doc.activeElement))) root.classList.add('toolbar-hidden');
    }, demora);
  };
  const mostrar = () => { cancelar(); root.classList.remove('toolbar-hidden'); };
  const entrar = () => { dentro = true; mostrar(); };
  const salir = () => { dentro = false; programar(); };
  const mover = event => { if (event.clientY <= 18) { mostrar(); programar(); } };
  const apuntar = () => { teclado = false; programar(); };
  const tecla = event => { if (event.key === 'Tab') teclado = true; };
  const enfocar = () => { mostrar(); programar(); };
  const pantalla = () => { mostrar(); programar(); };
  root.classList.add('toolbar-auto');
  barra.addEventListener('pointerenter', entrar);
  barra.addEventListener('pointerleave', salir);
  barra.addEventListener('focusin', enfocar);
  barra.addEventListener('focusout', programar);
  doc.addEventListener('pointermove', mover, { passive: true });
  doc.addEventListener('pointerdown', apuntar, true);
  doc.addEventListener('keydown', tecla, true);
  doc.addEventListener('fullscreenchange', pantalla);
  programar();
  return () => {
    cancelar(); root.classList.remove('toolbar-auto', 'toolbar-hidden');
    barra.removeEventListener('pointerenter', entrar);
    barra.removeEventListener('pointerleave', salir);
    barra.removeEventListener('focusin', enfocar);
    barra.removeEventListener('focusout', programar);
    doc.removeEventListener('pointermove', mover);
    doc.removeEventListener('pointerdown', apuntar, true);
    doc.removeEventListener('keydown', tecla, true);
    doc.removeEventListener('fullscreenchange', pantalla);
  };
}
