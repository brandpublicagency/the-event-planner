
import React, { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { useToast } from '@/hooks/use-toast';
import { getVenueNames } from '@/utils/venueUtils';
import { formatMenuDetails } from '@/utils/menu/formatMenuDetails';
import { cleanItemDescription } from '@/utils/menu/formatHelpers';

// Define interface for the print props
interface PrintMenuProps {
  event: Event;
  menuState: MenuState;
}

// Helper function to format the menu text with proper HTML structure
const formatMenuText = (text: string): JSX.Element => {
  if (!text) return <></>;
  
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, index) => {
        if (line.startsWith('*')) {
          // This is a section header
          const headerText = line.replace('*', '').trim();
          return (
            <div key={index} className="section-header">
              {headerText}
            </div>
          );
        } else if (line.startsWith('•')) {
          // This is a bullet point item - remove bullet and just show text
          const itemText = line.replace('•', '').trim();
          return <p key={index} className="menu-item">{itemText}</p>;
        } else if (line.trim().endsWith(':')) {
          // This is a category label
          return <p key={index} className="category-label">{line}</p>;
        } else if (line.trim().startsWith('CANAPÉS') || 
                  line.trim().startsWith('DESSERT CANAPÉS')) {
          // This is a subsection header
          return <p key={index} className="category-label" style={{ fontWeight: 'bold' }}>{line}</p>;
        } else if (line.trim()) {
          // This is a regular item
          return <p key={index} className="menu-item">{line}</p>;
        }
        return line.trim() ? <p key={index}>{line}</p> : <br key={index} />;
      })}
    </>
  );
};

// Component that will be printed
const MenuContent = React.forwardRef<HTMLDivElement, PrintMenuProps>(({ event, menuState }, ref) => {
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    // Format: "29 March 2025"
    return format(new Date(dateString), 'dd MMMM yyyy');
  };

  // Get event type
  const getEventType = (event: Event) => {
    return event.event_type || 'Event';
  };

  // Format menu details using the utility function
  const formattedMenu = formatMenuDetails(menuState);

  return (
    <div ref={ref} className="print-container p-8 max-w-[210mm] mx-auto">
      {/* Print header - LEFT ALIGNED as requested */}
      <div className="print-header">
        <h2>{event.name || 'Event'}</h2>
        <p>
          {formatDate(event.event_date)} / {event.pax} Guests / {getEventType(event)} / {getVenueNames(event)}
        </p>
      </div>

      <div className="menu-content">
        {/* Display formatted menu content */}
        <div className="whitespace-pre-line">
          {formatMenuText(formattedMenu)}
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
  
  // Log when the component mounts with debug info
  useEffect(() => {
    console.log("Regular Print component mounted");
    console.log("Print ref initialized:", !!componentRef.current);
    console.log("Event data:", event.name, event.event_code);
    console.log("Menu state summary:", {
      isCustom: menuState.isCustomMenu,
      mainCourseType: menuState.mainCourseType,
      starterType: menuState.selectedStarterType,
      dessertType: menuState.dessertType
    });
  }, [event, menuState]);
  
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

  return (
    <>
      <Button 
        onClick={onPrintClick}
        className="rounded-full" 
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
