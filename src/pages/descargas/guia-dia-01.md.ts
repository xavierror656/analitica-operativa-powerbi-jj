import guia from '../../content/guia-dia-01.md?raw';
import recetas from '../../data/dia-01-pasos.json';
import { componerGuiaDia1 } from '../../lib/guia-dia-01.mjs';

export function GET() {
  return new Response(componerGuiaDia1(guia, recetas), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
