import guia from '../../content/guia-dia-04.md?raw';

export function GET() {
  return new Response(guia.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
