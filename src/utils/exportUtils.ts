import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const htmlToPlainText = (html: string) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export const exportAsPdf = async (html: string, title: string) => {
  // Create a temporary container to render the HTML
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  
  // Add custom styles to match editor formatting
  const style = document.createElement('style');
  style.textContent = `
    .pdf-content {
      font-size: 10pt;
      line-height: 1.4;
      font-family: Arial, sans-serif;
    }
    h1 { font-size: 14pt; font-weight: bold; margin: 12pt 0 8pt 0; }
    h2 { font-size: 12pt; font-weight: bold; margin: 10pt 0 8pt 0; }
    h3 { font-size: 11pt; font-weight: bold; margin: 8pt 0 8pt 0; }
    ul, ol { padding-left: 20pt; margin: 8pt 0; }
    li { margin: 4pt 0; font-size: 10pt; }
    p { margin: 8pt 0; font-size: 10pt; }
    blockquote { margin: 12pt 0; padding-left: 12pt; border-left: 3pt solid #e5e5e5; }
  `;
  container.appendChild(style);
  container.className = 'pdf-content';
  
  // Initialize PDF with A4 format
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  // Set title
  doc.setFontSize(14);
  doc.text(title, 40, 40);
  
  // Convert HTML content to PDF
  await doc.html(container, {
    callback: function (doc) {
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      // Clean up
      document.body.removeChild(container);
    },
    x: 40,
    y: 60,
    width: doc.internal.pageSize.getWidth() - 80, // 40pt margins on each side
    windowWidth: 794, // A4 width in points
    html2canvas: {
      scale: 1,
      useCORS: true,
      logging: false,
    },
  });
};

export const exportAsDocx = async (html: string, title: string) => {
  const text = htmlToPlainText(html);
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 32,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              size: 24,
            }),
          ],
        }),
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
