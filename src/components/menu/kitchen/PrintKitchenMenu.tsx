
import React, { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { useToast } from '@/components/ui/use-toast';
import KitchenMenuContent from './KitchenMenuContent';

// Define interface for the print props
interface PrintMenuProps {
  event: Event;
  menuState: MenuState;
}

// Print button component
export const PrintKitchenMenu: React.FC<PrintMenuProps> = ({ event, menuState }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Log when the component ref is available
  useEffect(() => {
    console.log("Component mounted, ref status:", !!componentRef.current);
  }, []);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Kitchen Menu - ${event.name}`,
    onBeforePrint: () => {
      console.log("Preparing to print...");
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Print completed or canceled");
      toast({
        title: "Print action completed",
        description: "Your menu has been sent to the printer or saved as PDF."
      });
    },
    onPrintError: (errorLocation, error) => {
      console.error(`Print error (${errorLocation}):`, error);
      toast({
        title: "Print error",
        description: "There was a problem printing your menu. Please try again.",
        variant: "destructive"
      });
    },
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
    console.log("Print button clicked, component ref:", componentRef.current);
    if (!componentRef.current) {
      toast({
        title: "Print error",
        description: "Could not prepare the menu for printing. Please try again.",
        variant: "destructive"
      });
      return;
    }
    handlePrint();
  };

  return (
    <>
      <Button 
        onClick={onPrintClick}
        className="print-button rounded-full" 
        variant="outline"
        size="sm"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Menu
      </Button>
      <div style={{ 
        position: "absolute", 
        left: "-9999px",
        top: 0,
        width: "210mm",
        height: "auto",
      }}>
        <KitchenMenuContent ref={componentRef} event={event} menuState={menuState} />
      </div>
    </>
  );
};

export default PrintKitchenMenu;
