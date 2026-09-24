import { leer, guardar } from './curso-personal.mjs';
export function conectarEntregas(document, window) {
  for (const panel of document.querySelectorAll('[data-evidencia]')) {
    const id = panel.dataset.evidencia, clave = 'powerbi:entrega:v1:' + id;
    const checks = [...panel.querySelectorAll('[data-criterio]')];
    const notas = panel.querySelector('[data-notas]'), status = panel.querySelector('[role=status]');
    const valor = leer(() => window.localStorage, clave, {});
    for (const check of checks) check.checked = valor?.criterios?.[check.dataset.criterio] === true;
    notas.value = typeof valor?.notas === 'string' ? valor.notas.slice(0, 5000) : '';
    function contar() { panel.querySelector('[data-conteo]').textContent = `${checks.filter(c => c.checked).length} de ${checks.length} requisitos comprobados por ti`; }
    function persistir() {
      guardar(() => window.localStorage, clave, {version:1, criterios:Object.fromEntries(checks.map(c=>[c.dataset.criterio,c.checked])), notas:notas.value}, status);
      contar();
    }
    checks.forEach(c => c.addEventListener('change', persistir));
    notas.addEventListener('input', persistir);
    contar();
    panel.querySelector('[data-exportar]').addEventListener('click', () => {
      const texto = `# Autoevaluación ${id}\n\nFecha: ${new Date().toISOString()}\nRegistro personal; no constituye evaluación del instructor ni envío de archivos.\n\n` +
        checks.map(c => `- [${c.checked ? 'x' : ' '}] ${c.parentElement.textContent.trim()}`).join('\n') + '\n\n## Pruebas y pendientes\n\n' + notas.value + '\n';
      const url = window.URL.createObjectURL(new window.Blob([texto], {type:'text/markdown;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = `autoevaluacion-${id}.md`;
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      status.textContent = 'Registro preparado para descargar.';
    });
  }
}
