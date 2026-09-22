import guia from '../../content/guia-dia-01.md?raw';
import recetas from '../../data/dia-01-pasos.json';

export function GET() {
  const pasos = recetas.map((receta) => [
    `<a id="paso-${receta.id}"></a>`,
    `## ${receta.titulo}`, `**Dónde:** ${receta.ubicacion}`,
    receta.pasos.map((paso, i) => `${i + 1}. **${paso.accion}.** ${paso.detalle}`).join('\n'),
    receta.formula ? `\`\`\`powerquery\n${receta.formula}\n\`\`\`` : '',
    `**Comprueba:** ${receta.comprueba}`, `**Al terminar:** ${receta.entrega}`,
    receta.ayuda ? `**Si necesitas más detalle:** ${receta.ayuda}` : '',
    receta.enlaces ? 'Recetas de apoyo: ' + receta.enlaces.map((id) => `[${recetas.find((item) => item.id === id)?.titulo}](#paso-${id})`).join(' · ') : '',
  ].filter(Boolean).join('\n\n')).join('\n\n');
  const introduccion = '# Día 1 · Resuelve paso a paso\n\nPuedes consultar la guía, copiar fórmulas y pedir apoyo. Evaluamos aplicación, comprobación y explicación; no memorización.\n\nLas fórmulas son de Power Query (M). Python se verá el día 5.\n\n';
  return new Response(introduccion + pasos + '\n\n' + guia.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
