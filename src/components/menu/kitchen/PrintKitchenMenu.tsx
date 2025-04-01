
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import KitchenMenuContent from './KitchenMenuContent';
import { useKitchenPrintMenu } from './useKitchenPrintMenu';

// Define interface for the print props
interface PrintKitchenMenuProps {
  event: Event;
  menuState: MenuState;
}

// Print button component
export const PrintKitchenMenu: React.FC<PrintKitchenMenuProps> = ({ 
  event, 
  menuState 
}) => {
  const { componentRef, onPrintClick } = useKitchenPrintMenu(event);

  return (
    <>
      <Button 
        onClick={onPrintClick}
        className="print-button rounded-full" 
        variant="outline"
        size="sm"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Kitchen Menu
      </Button>
      <div style={{ 
        position: "absolute", 
        left: "-9999px",
        top: 0,
        width: "210mm",
        height: "auto",
        overflow: "visible", // Ensure content isn't cut off
      }}>
        <KitchenMenuContent ref={componentRef} event={event} menuState={menuState} />
      </div>
    </>
  );
};

export default PrintKitchenMenu;
