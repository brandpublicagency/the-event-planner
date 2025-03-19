
import React, { useRef } from 'react';
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
        margin: 15mm !important;
        size: A4;
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
        
        /* Print header - LEFT ALIGNED as requested */
        .print-header h2 {
          font-size: 16px !important;
          font-weight: bold !important;
          text-align: left !important;
          margin-bottom: 4px !important;
        }
        
        .print-header p {
          font-size: 12px !important;
          text-align: left !important;
          margin-bottom: 0 !important;
        }
        
        /* Header divider - 0.75px black line */
        .print-header:after {
          content: "" !important;
          display: block !important;
          width: 100% !important;
          border-bottom: 0.75px solid #000 !important;
          margin-top: 16px !important;
          margin-bottom: 16px !important;
        }
        
        /* Section headers - UPPERCASE, BOLD, 10PX */
        .section-header {
          text-transform: uppercase !important;
          font-weight: bold !important;
          font-size: 10px !important;
          margin-top: 16px !important;
          margin-bottom: 4px !important;
          text-align: left !important;
        }
        
        /* Add 0.25px black divider after section headers */
        .section-header:after {
          content: "" !important;
          display: block !important;
          width: 100% !important;
          border-bottom: 0.25px solid #000 !important;
          margin-top: 4px !important;
          margin-bottom: 8px !important;
        }
        
        /* Menu items */
        .menu-item {
          font-size: 12px !important;
          margin-bottom: 4px !important;
          text-align: left !important;
        }
        
        /* Category labels (e.g., "Meat Selections:") */
        .category-label {
          font-weight: 600 !important;
          margin-top: 8px !important;
          margin-bottom: 4px !important;
          text-align: left !important;
        }
      }
    `,
  });

  const onPrintClick = () => {
    console.log("Print button clicked, component ref:", componentRef.current);
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
