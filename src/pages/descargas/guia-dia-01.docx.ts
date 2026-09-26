import guia from '../../content/guia-dia-01.md?raw';
import recetas from '../../data/dia-01-pasos.json';
import { componerGuiaDia1 } from '../../lib/guia-dia-01.mjs';
import { crearDocumentoWord } from '../../lib/documento-word.mjs';

export async function GET() {
  return new Response(await crearDocumentoWord(componerGuiaDia1(guia, recetas)), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="guia-dia-01.docx"',
    },
  });
}
