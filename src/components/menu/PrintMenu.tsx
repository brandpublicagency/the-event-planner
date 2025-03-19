
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { useToast } from '@/components/ui/use-toast';
import { getVenueNames } from '@/utils/venueUtils';
import { formatMenuDetails } from '@/utils/formatMenuDetails';

// Define interface for the print props
interface PrintMenuProps {
  event: Event;
  menuState: MenuState;
}

// Component that will be printed
const MenuContent = React.forwardRef<HTMLDivElement, PrintMenuProps>(({ event, menuState }, ref) => {
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    return format(new Date(dateString), 'dd MMMM yyyy');
  };

  // Format menu details using the utility function
  const formattedMenu = formatMenuDetails(menuState);

  return (
    <div ref={ref} className="print-container p-8 max-w-[210mm] mx-auto">
      {/* Print header - without "MENU SELECTION" heading */}
      <div className="text-center mb-6 print-header">
        <h2 className="text-lg font-medium">{event.name || 'Event'}</h2>
        <p className="text-sm text-gray-600">
          {formatDate(event.event_date)} | {event.pax} Guests | {getVenueNames(event)}
        </p>
      </div>

      <div className="menu-content">
        {/* Display formatted menu content */}
        <div className="whitespace-pre-line">
          {formattedMenu}
        </div>
      </div>
    </div>
  );
});

MenuContent.displayName = 'MenuContent';

// Print button component
export const PrintMenu: React.FC<PrintMenuProps> = ({ event, menuState }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handlePrint = useReactToPrint({
    documentTitle: `Menu - ${event.name}`,
    onBeforePrint: () => {
      console.log("Preparing to print menu...");
      return Promise.resolve();
    },
    onAfterPrint: () => {
      toast({
        title: "Print complete",
        description: "Your menu has been sent to the printer or saved as PDF."
      });
    },
    onPrintError: (error) => {
      console.error("Print error:", error);
      toast({
        title: "Print error",
        description: "There was a problem printing your menu. Please try again.",
        variant: "destructive"
      });
    },
    contentRef: componentRef,
  });

  return (
    <>
      <Button 
        onClick={() => {
          if (componentRef.current) {
            handlePrint();
          }
        }}
        className="rounded-full" 
        variant="outline"
        size="sm"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Menu
      </Button>
      <div style={{ display: "none" }}>
        <MenuContent ref={componentRef} event={event} menuState={menuState} />
      </div>
    </>
  );
};
