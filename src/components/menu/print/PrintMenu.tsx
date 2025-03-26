
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import MenuContent from './MenuContent';
import { usePrintMenu } from './usePrintMenu';

// Define interface for the print props
interface PrintMenuProps {
  event: Event;
  menuState: MenuState;
}

// Print button component
export const PrintMenu: React.FC<PrintMenuProps> = ({ event, menuState }) => {
  const { componentRef, onPrintClick } = usePrintMenu(event);

  return (
    <>
      <Button 
        onClick={onPrintClick}
        className="rounded-full print-hide" 
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
        overflow: "visible", // Ensure content isn't cut off
      }}>
        <MenuContent ref={componentRef} event={event} menuState={menuState} />
      </div>
    </>
  );
};

export default PrintMenu;
