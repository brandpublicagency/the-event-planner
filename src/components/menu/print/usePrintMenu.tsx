
import { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';

export const usePrintMenu = (event: Event) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Log when the component mounts with debug info
  useEffect(() => {
    console.log("Regular Print component mounted");
    console.log("Print ref initialized:", !!componentRef.current);
    console.log("Event data:", event.name, event.event_code);
  }, [event]);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Menu - ${event.name}`,
    onBeforePrint: () => {
      console.log("Preparing to print regular menu...");
      if (!componentRef.current) {
        console.error("Print ref is not available for regular menu!");
      }
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Regular menu print completed or canceled");
      toast({
        title: "Print complete",
        description: "Your menu has been sent to the printer or saved as PDF."
      });
    },
    onPrintError: (error) => {
      console.error("Regular menu print error:", error);
      toast({
        title: "Print error",
        description: "There was a problem printing your menu. Please try again.",
        variant: "destructive"
      });
    },
    contentRef: componentRef,
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
        .print-container {
          width: 210mm;
          height: auto;
          padding: 15mm;
          margin: 0 !important;
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
          margin-left: 10px;
        }
      }
    `,
  });

  const onPrintClick = () => {
    console.log("Regular Print button clicked");
    console.log("Print component ref available:", !!componentRef.current);
    
    if (!componentRef.current) {
      console.error("Print component ref is not available for regular menu!");
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
