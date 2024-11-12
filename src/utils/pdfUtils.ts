import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = async (menuState: any, eventName?: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Menu Selection', 105, 20, { align: 'center' });
  
  if (eventName) {
    doc.setFontSize(14);
    doc.text(eventName, 105, 30, { align: 'center' });
  }

  // Add content
  doc.setFontSize(12);
  let yPos = 50;

  if (menuState.isCustomMenu) {
    doc.text('Custom Menu:', 20, yPos);
    yPos += 10;
    const splitText = doc.splitTextToSize(menuState.customMenuDetails || '', 170);
    doc.text(splitText, 20, yPos);
    yPos += splitText.length * 7;
  } else {
    if (menuState.selectedStarterType) {
      doc.text(`Starter Type: ${menuState.selectedStarterType}`, 20, yPos);
      yPos += 15;

      if (menuState.selectedStarterType === 'canapes') {
        doc.text(`Number of Canapés: ${menuState.selectedCanapePackage}`, 20, yPos);
        yPos += 10;
        
        menuState.selectedCanapes.forEach((canape: string, index: number) => {
          doc.text(`${index + 1}. ${canape}`, 20, yPos);
          yPos += 7;
        });
      } else if (menuState.selectedStarterType === 'plated') {
        doc.text(`Selected Starter: ${menuState.selectedPlatedStarter}`, 20, yPos);
        yPos += 10;
      }
    }
  }

  if (menuState.notes) {
    yPos += 10;
    doc.text('Notes:', 20, yPos);
    yPos += 10;
    const splitNotes = doc.splitTextToSize(menuState.notes, 170);
    doc.text(splitNotes, 20, yPos);
  }

  return doc.output('blob');
};