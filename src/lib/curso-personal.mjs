export const ESTADOS = ['pendiente', 'en-proceso', 'terminada'];
export function leer(storage, clave, fallback) {
  try { return JSON.parse(storage().getItem(clave)) ?? fallback; } catch { return fallback; }
}
export function guardar(storage, clave, valor, estado) {
  try {
    storage().setItem(clave, JSON.stringify(valor));
    estado.textContent = 'Guardado en este navegador.';
  } catch { estado.textContent = 'No se pudo guardar. Puedes continuar, pero los cambios se perderán al salir.'; }
}
export function conectarCurso(document, window) {
  // Las tablas anchas deben poder desplazarse también con las flechas del teclado.
  for (const tabla of document.querySelectorAll('.reading table')) {
    const ajustar = () => {
      if (tabla.scrollWidth > tabla.clientWidth + 1) tabla.setAttribute('tabindex', '0');
      else tabla.removeAttribute('tabindex');
    };
    ajustar();
    if (window.ResizeObserver) new window.ResizeObserver(ajustar).observe(tabla);
  }
  const storage = () => window.localStorage;
  const ultimo = leer(storage, 'powerbi:ultima:v1', null);
  const enlace = document.querySelector('[data-continuar]');
  if (enlace && ultimo?.version === 1 && Number.isInteger(ultimo.h) && ultimo.h >= 0 &&
      Number.isInteger(ultimo.v) && ultimo.v >= 0 &&
      typeof ultimo.pathname === 'string' &&
      /^\/(?:dia-0[1-5]|practicas\/[2-5]-[1-4])\/?$/.test(ultimo.pathname)) {
    enlace.href = ultimo.pathname.replace(/\/$/, '') + '/#/' + ultimo.h + '/' + ultimo.v;
    enlace.textContent = `Continuar ${ultimo.pathname.includes('practicas') ? 'práctica ' + ultimo.pathname.match(/[2-5]-[1-4]/)[0].replace('-', '.') : 'día ' + ultimo.pathname.match(/0([1-5])/)[1]} · diapositiva ${ultimo.h + 1}`;
    enlace.hidden = false;
    document.querySelector('[data-sin-avance]')?.setAttribute('hidden', '');
  }
  const controles = [...document.querySelectorAll('[data-actividad-estado]')];
  const resumen = document.querySelector('[data-resumen-avance]');
  function actualizar() {
    if (resumen) resumen.textContent = `${controles.filter(c => c.value === 'terminada').length} de ${controles.length} prácticas terminadas`;
  }
  for (const control of controles) {
    const clave = 'powerbi:practica:v1:' + control.dataset.actividadEstado;
    const valor = leer(storage, clave, 'pendiente');
    control.value = ESTADOS.includes(valor) ? valor : 'pendiente';
    control.addEventListener('change', () => {
      guardar(storage, clave, control.value, control.parentElement.querySelector('[role=status]'));
      actualizar();
    });
  }
  actualizar();
  window.addEventListener('storage', () => {
    for (const control of controles) {
      const valor = leer(storage, 'powerbi:practica:v1:' + control.dataset.actividadEstado, 'pendiente');
      control.value = ESTADOS.includes(valor) ? valor : 'pendiente';
    }
    actualizar();
  });
}
