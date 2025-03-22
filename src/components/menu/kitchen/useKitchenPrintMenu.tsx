
import { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types/event';

export const useKitchenPrintMenu = (event: Event) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Log when the component mounts with debug info
  useEffect(() => {
    console.log("Kitchen Print component mounted");
    console.log("Print ref initialized:", !!componentRef.current);
    console.log("Event data:", event.name, event.event_code);
  }, [event]);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Kitchen Menu - ${event.name}`,
    onBeforePrint: () => {
      console.log("Preparing to print kitchen menu...");
      if (!componentRef.current) {
        console.error("Print ref is not available!");
      }
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Kitchen menu print completed or canceled");
      toast({
        title: "Print complete",
        description: "Your kitchen menu has been sent to the printer or saved as PDF."
      });
    },
    onPrintError: (error) => {
      console.error("Kitchen menu print error:", error);
      toast({
        title: "Print error",
        description: "There was a problem printing your kitchen menu. Please try again.",
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
        * {
          box-sizing: border-box;
          text-align: left;
        }
        h1, h2, h3, h4, h5, h6 {
          text-align: left;
        }
        .print-container {
          width: 210mm;
          height: auto;
          padding: 15mm;
          margin: 0 !important;
          text-align: left;
        }
        h1 {
          font-size: 16px;
          font-weight: normal;
          margin-bottom: 16px;
          text-align: left;
        }
        h2 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
          text-align: left;
        }
        h3 {
          font-size: 14px;
          font-weight: normal;
          margin-bottom: 8px;
          text-align: left;
        }
        p {
          font-size: 12px;
          margin: 0;
          margin-bottom: 4px;
          text-align: left;
        }
        hr {
          margin: 16px 0;
          border-color: #ddd;
        }
      }
    `,
  });

  const onPrintClick = () => {
    console.log("Kitchen Print button clicked");
    console.log("Print component ref available:", !!componentRef.current);
    
    if (!componentRef.current) {
      console.error("Print component ref is not available!");
      toast({
        title: "Print error",
        description: "Could not prepare the kitchen menu for printing. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    handlePrint();
  };
  
  return { componentRef, onPrintClick };
};
