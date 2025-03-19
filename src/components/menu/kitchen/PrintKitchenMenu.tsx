
import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { useToast } from '@/components/ui/use-toast';
import KitchenMenuContent from './KitchenMenuContent';
import { getPageStyle } from './printStyles';

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
    pageStyle: getPageStyle(),
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
