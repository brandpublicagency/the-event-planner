import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';

const htmlToPlainText = (html: string) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export const exportAsPdf = async (html: string, title: string) => {
  const doc = new jsPDF();
  const text = htmlToPlainText(html);
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  
  // Add content
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(text, 170);
  doc.text(splitText, 20, 30);
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
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