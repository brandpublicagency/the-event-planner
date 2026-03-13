
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/** Parse HTML into a temporary DOM element */
const parseHtml = (html: string): HTMLElement => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp;
};

const htmlToPlainText = (html: string) => {
  return parseHtml(html).textContent || '';
};

export const exportAsPdf = async (html: string, title: string) => {
  const container = document.createElement('div');
  container.innerHTML = html;
  
  const style = document.createElement('style');
  style.textContent = `
    .pdf-content {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      max-width: 100%;
      padding: 20pt;
    }
    h1 { font-size: 16pt; font-weight: bold; margin: 14pt 0 10pt 0; }
    h2 { font-size: 14pt; font-weight: bold; margin: 12pt 0 8pt 0; }
    h3 { font-size: 12pt; font-weight: bold; margin: 10pt 0 6pt 0; }
    p { margin: 0 0 8pt 0; }
    ul, ol { margin: 6pt 0; padding-left: 16pt; }
    li { margin: 4pt 0; }
    blockquote { 
      margin: 10pt 0;
      padding-left: 10pt;
      border-left: 2pt solid #666;
      font-style: italic;
    }
    img { max-width: 100%; height: auto; }
    a { color: #2563eb; text-decoration: underline; }
  `;
  
  container.appendChild(style);
  container.className = 'pdf-content';
  document.body.appendChild(container);

  // Wait for images to load
  const imgs = Array.from(container.querySelectorAll('img'));
  await Promise.all(imgs.map(img => new Promise<void>(resolve => {
    if (img.complete) { resolve(); return; }
    img.onload = () => resolve();
    img.onerror = () => resolve();
  })));

  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
    orientation: 'portrait'
  });

  doc.setFontSize(16);
  doc.text(title, 40, 40);

  await doc.html(container, {
    callback: function (doc) {
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      document.body.removeChild(container);
    },
    x: 40,
    y: 80,
    width: doc.internal.pageSize.getWidth() - 80,
    autoPaging: 'text',
    windowWidth: 794,
    margin: [40, 40, 40, 40],
    html2canvas: {
      scale: 0.7,
      useCORS: true,
      logging: false,
    },
  });
};

/** Parse HTML nodes into docx Paragraph elements with basic formatting */
function htmlToDocxParagraphs(container: HTMLElement): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        paragraphs.push(new Paragraph({ children: [new TextRun({ text, size: 24 })] }));
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'h1') {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: el.textContent || '', bold: true, size: 32 })],
      }));
    } else if (tag === 'h2') {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: el.textContent || '', bold: true, size: 28 })],
      }));
    } else if (tag === 'h3') {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: el.textContent || '', bold: true, size: 26 })],
      }));
    } else if (tag === 'p' || tag === 'div') {
      const runs = inlineRuns(el);
      if (runs.length > 0) {
        paragraphs.push(new Paragraph({ children: runs }));
      }
    } else if (tag === 'blockquote') {
      paragraphs.push(new Paragraph({
        indent: { left: 720 },
        children: [new TextRun({ text: el.textContent || '', italics: true, size: 24 })],
      }));
    } else if (tag === 'ul' || tag === 'ol') {
      el.querySelectorAll(':scope > li').forEach(li => {
        const bullet = tag === 'ul' ? '• ' : '';
        paragraphs.push(new Paragraph({
          indent: { left: 720 },
          children: [new TextRun({ text: `${bullet}${li.textContent || ''}`, size: 24 })],
        }));
      });
    } else if (tag === 'hr') {
      paragraphs.push(new Paragraph({ children: [] }));
    } else {
      // Recurse for wrappers
      Array.from(el.childNodes).forEach(processNode);
    }
  };

  Array.from(container.childNodes).forEach(processNode);
  return paragraphs;
}

/** Extract inline runs from an element, preserving bold/italic */
function inlineRuns(el: HTMLElement): TextRun[] {
  const runs: TextRun[] = [];
  const walk = (node: Node, bold = false, italic = false, underline = false) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text) {
        runs.push(new TextRun({ text, bold, italics: italic, underline: underline ? {} : undefined, size: 24 } as any));
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = (node as HTMLElement).tagName.toLowerCase();
    const b = bold || tag === 'strong' || tag === 'b';
    const i = italic || tag === 'em' || tag === 'i';
    const u = underline || tag === 'u';
    Array.from(node.childNodes).forEach(child => walk(child, b, i, u));
  };
  walk(el);
  return runs;
}

export const exportAsDocx = async (html: string, title: string) => {
  const container = parseHtml(html);
  const bodyParagraphs = htmlToDocxParagraphs(container);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: title, bold: true, size: 32 })],
        }),
        ...bodyParagraphs,
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
