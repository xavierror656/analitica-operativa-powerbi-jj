export const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function buscar(indice, consulta, dia = '') {
  const palabras = normalizar(consulta).trim().split(/\s+/).filter(Boolean);
  if (!palabras.length) return [];
  return indice.filter(item => (!dia || String(item.dia) === dia) &&
    palabras.every(p => normalizar(item.titulo + ' ' + item.texto).includes(p)))
    .sort((a, b) => palabras.filter(p => normalizar(b.titulo).includes(p)).length - palabras.filter(p => normalizar(a.titulo).includes(p)).length);
}
