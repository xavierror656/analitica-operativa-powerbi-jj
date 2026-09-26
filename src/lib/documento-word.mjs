import { marked } from 'marked';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow,
  TableCell, WidthType, ExternalHyperlink, InternalHyperlink, Bookmark,
  Footer, PageNumber, AlignmentType,
} from 'docx';

const marcador = (id) => id.replace(/[^a-zA-Z0-9_]/g, '_');

function inline(tokens = [], formato = {}) {
  return tokens.flatMap((token) => {
    if (token.type === 'strong') return inline(token.tokens, { ...formato, bold: true });
    if (token.type === 'em') return inline(token.tokens, { ...formato, italics: true });
    if (token.type === 'link') {
      const children = inline(token.tokens, { ...formato, style: 'Hyperlink' });
      return [token.href.startsWith('#')
        ? new InternalHyperlink({ anchor: marcador(token.href.slice(1)), children })
        : new ExternalHyperlink({ link: token.href, children })];
    }
    if (token.type === 'br') return [new TextRun({ break: 1 })];
    if (token.type === 'html') {
      const id = token.raw.match(/^<a id="([^"]+)">$/)?.[1];
      if (id) return [new Bookmark({ id: marcador(id), children: [] })];
      if (token.raw === '</a>') return [];
      throw new Error(`HTML inline no soportado en Word: ${token.raw}`);
    }
    if (token.tokens) return inline(token.tokens, formato);
    return [new TextRun({ ...formato, text: token.text || '',
      ...(token.type === 'codespan' ? { font: 'Consolas', size: 19 } : {}) })];
  });
}

function bloques(tokens) {
  return tokens.flatMap((token) => {
    switch (token.type) {
      case 'space': return [];
      case 'heading': return [new Paragraph({ heading: HeadingLevel[`HEADING_${token.depth}`], children: inline(token.tokens) })];
      case 'paragraph':
      case 'text': return [new Paragraph({ children: inline(token.tokens || [{ type: 'text', text: token.text }]) })];
      case 'list': return token.items.flatMap((item, i) => {
        const contenido = bloques(item.tokens.filter(t => t.type !== 'checkbox'));
        const primero = item.tokens.find(t => t.type === 'text' || t.type === 'paragraph');
        if (primero) contenido[0] = new Paragraph({
          indent: { left: 300, hanging: 300 },
          children: [new TextRun(item.task ? (item.checked ? '☑ ' : '☐ ') : token.ordered ? `${Number(token.start) + i}. ` : '• '), ...inline(primero.tokens)],
        });
        return contenido;
      });
      case 'code': return token.text.split('\n').map((linea, i, lineas) => new Paragraph({
        style: 'Codigo', keepNext: i < lineas.length - 1,
        children: [new TextRun({ text: linea, font: 'Consolas', size: 18 })],
      }));
      case 'table': return [new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: token.header.map(() => Math.floor(10200 / token.header.length)),
        rows: [token.header, ...token.rows].map((fila, i) => new TableRow({
          tableHeader: i === 0,
          children: fila.map(celda => new TableCell({
            margins: { top: 90, bottom: 90, left: 90, right: 90 },
            ...(i === 0 ? { shading: { fill: 'E3F0EC' } } : {}),
            children: [new Paragraph({ spacing: { after: 40 }, children: inline(celda.tokens, { size: 18, bold: i === 0 }) })],
          })),
        })),
      }), new Paragraph({ text: '', spacing: { after: 60 } })];
      case 'blockquote': return bloques(token.tokens);
      case 'hr': return [new Paragraph({ text: '────────────────────' })];
      case 'html': {
        const id = token.raw.match(/^<a id="([^"]+)"><\/a>\s*$/)?.[1];
        if (!id) throw new Error(`HTML no soportado en Word: ${token.raw}`);
        return [new Paragraph({ spacing: { after: 0 }, keepNext: true, children: [new Bookmark({ id: marcador(id), children: [] })] })];
      }
      default: throw new Error(`Bloque Markdown no soportado: ${token.type}`);
    }
  });
}

export async function crearDocumentoWord(markdown) {
  const documento = new Document({
    title: 'Día 1 · Guía y bitácora A1', creator: 'Analítica operativa · Power BI',
    description: 'Recetas, controles y plantilla editable de la evidencia A1.',
    styles: {
      default: { document: { run: { font: 'Calibri', size: 22 }, paragraph: { spacing: { after: 140, line: 276 } } } },
      paragraphStyles: [
        ...[1, 2, 3, 4, 5, 6].map(n => ({ id: `Heading${n}`, name: `Heading ${n}`, basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: 'Calibri', bold: true, color: '075E54', size: n === 1 ? 36 : n === 2 ? 28 : 24 },
          paragraph: { keepNext: true, spacing: { before: 240, after: 120 }, outlineLevel: n - 1 } })),
        { id: 'Codigo', name: 'Código', basedOn: 'Normal', run: { font: 'Consolas', size: 18 },
          paragraph: { spacing: { after: 0, line: 240 }, shading: { fill: 'F1F4F5' } } },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 850, bottom: 850, left: 850, right: 850 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: 'Día 1 · A1 | ', size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })] }) },
      children: bloques(marked.lexer(markdown)),
    }],
  });
  return new Uint8Array(await Packer.toBuffer(documento));
}
