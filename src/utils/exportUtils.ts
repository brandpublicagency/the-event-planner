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
  
  // Initialize PDF with larger page size
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 40, 40);
  
  // Get the computed styles
  const computedStyle = window.getComputedStyle(container);
  
  // Set default styles
  doc.setFontSize(12);
  doc.setFont('helvetica');
  
  // Convert HTML content to PDF with styling
  doc.html(container, {
    callback: function (doc) {
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      // Clean up
      document.body.removeChild(container);
    },
    x: 40,
    y: 60,
    width: 515, // A4 width minus margins
    windowWidth: 675, // Reference HTML width
    autoPaging: true,
    margin: [40, 40, 40, 40],
    html2canvas: {
      scale: 0.7,
      useCORS: true,
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