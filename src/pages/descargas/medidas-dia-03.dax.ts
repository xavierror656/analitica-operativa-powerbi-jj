import medidas from '../../data/medidas-dia-03.json';
export function GET() {
  const texto = '// Crear cada definición por separado con Nueva medida en Power BI Desktop.\n'
    + '// Comas como separador DAX. Ajustar según la configuración regional del editor.\n\n'
    + medidas.map(m => '// ' + m.formato + (m.principal ? ' · Indicador A3' : ' · Auxiliar o laboratorio')
      + '\n' + m.nombre + ' =\n' + m.expresion).join('\n\n');
  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
