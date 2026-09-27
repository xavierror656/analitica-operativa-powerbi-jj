/** Fuente compartida de las descargas Word y Markdown. */
export function componerGuiaDia1(guia, recetas) {
  const pasos = recetas.map((receta) => [
    `<a id="paso-${receta.id}"></a>`,
    `## ${receta.titulo}`, `**Dónde:** ${receta.ubicacion}`,
    receta.pasos.map((paso, i) => `${i + 1}. **${paso.accion}.** ${paso.detalle}`).join('\n'),
    receta.formula ? `\`\`\`powerquery\n${receta.formula}\n\`\`\`` : '',
    `**Comprueba:** ${receta.comprueba}`, `**Al terminar:** ${receta.entrega}`,
    receta.ayuda ? `**Si necesitas más detalle:** ${receta.ayuda}` : '',
    receta.enlaces ? 'Recetas de apoyo: ' + receta.enlaces.map((id) => `[${recetas.find((item) => item.id === id)?.titulo}](#paso-${id})`).join(' · ') : '',
  ].filter(Boolean).join('\n\n')).join('\n\n');
  const introduccion = '# Día 1 · Guía y bitácora A1\n\nPuedes consultar la guía, copiar fórmulas y pedir apoyo. Evaluamos aplicación, comprobación y explicación; no memorización.\n\nLas recetas de limpieza usan Power Query (M). El extra de mantenimiento incluye medidas DAX.\n\n';
  return introduccion + pasos + '\n\n' + guia.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}
