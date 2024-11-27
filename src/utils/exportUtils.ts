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
    h1 { font-size: 24px; font-weight: bold; margin: 16px 0 8px 0; }
    h2 { font-size: 20px; font-weight: bold; margin: 14px 0 8px 0; }
    h3 { font-size: 16px; font-weight: bold; margin: 12px 0 8px 0; }
    ul { padding-left: 20px; margin: 8px 0; }
    ol { padding-left: 20px; margin: 8px 0; }
    li { margin: 4px 0; }
    ul li { list-style-type: disc; }
    ol li { list-style-type: decimal; }
    p { margin: 8px 0; }
    blockquote { margin: 12px 0; padding-left: 12px; border-left: 3px solid #e5e5e5; }
  `;
  container.appendChild(style);
  
  // Initialize PDF
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });
  
  // Add title
  doc.setFontSize(24);
  doc.text(title, 40, 40);
  
  // Convert HTML content to PDF
  doc.html(container, {
    callback: function (doc) {
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      // Clean up
      document.body.removeChild(container);
    },
    x: 40,
    y: 80,
    width: 515, // A4 width minus margins
    windowWidth: 675,
    autoPaging: true,
    margin: [40, 40, 40, 40],
    html2canvas: {
      scale: 0.7,
      useCORS: true,
      logging: false,
      onclone: function(clonedDoc) {
        // Ensure lists are properly rendered
        const lists = clonedDoc.querySelectorAll('ul, ol');
        lists.forEach(list => {
          if (list.tagName === 'UL') {
            list.style.listStyleType = 'disc';
          } else {
            list.style.listStyleType = 'decimal';
          }
        });
      }
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