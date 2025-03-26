
import { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types/event';

export const usePrintMenu = (event: Event) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Log when the component mounts with debug info
  useEffect(() => {
    console.log("Print component mounted");
    console.log("Print ref initialized:", !!componentRef.current);
    console.log("Event data:", event.name, event.event_code);
  }, [event]);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Menu - ${event.name}`,
    onBeforePrint: () => {
      console.log("Preparing to print menu...");
      if (!componentRef.current) {
        console.error("Print ref is not available!");
      }
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Menu print completed or canceled");
      toast({
        title: "Print complete",
        description: "Your menu has been sent to the printer or saved as PDF."
      });
    },
    onPrintError: (error) => {
      console.error("Menu print error:", error);
      toast({
        title: "Print error",
        description: "There was a problem printing your menu. Please try again.",
        variant: "destructive"
      });
    },
    contentRef: componentRef,
    // The line below was causing the error - removed it
    // removeAfterPrint: false, // This property doesn't exist in the type definition
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm !important;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-container {
          width: 210mm;
          height: auto;
          padding: 15mm;
          margin: 0 !important;
          background-color: white !important;
        }
        h2 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        p {
          margin: 0 0 4px 0;
        }
        .section-header {
          font-weight: bold;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        .category-label {
          font-weight: normal;
          margin-top: 10px;
          margin-bottom: 4px;
        }
        .menu-item {
          margin-left: 0;
        }
      }
    `,
  });

  const onPrintClick = () => {
    console.log("Print button clicked");
    console.log("Print component ref available:", !!componentRef.current);
    
    if (!componentRef.current) {
      console.error("Print component ref is not available!");
      toast({
        title: "Print error",
        description: "Could not prepare the menu for printing. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    handlePrint();
  };
  
  return { componentRef, onPrintClick };
};
