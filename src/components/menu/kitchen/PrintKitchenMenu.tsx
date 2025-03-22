
import React, { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import KitchenMenuContent from './KitchenMenuContent';

// Define interface for the print props
interface PrintMenuProps {
  event: Event;
  menuState: MenuState;
}

// Print button component
export const PrintKitchenMenu: React.FC<PrintMenuProps> = ({ event, menuState }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  
  // Log when the component mounts with debug info
  useEffect(() => {
    console.log("Kitchen Print component mounted");
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
    contentRef: componentRef,
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
    },
    onPrintError: (errorLocation, error) => {
      console.error(`Print error (${errorLocation}):`, error);
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
    console.log("Kitchen Print button clicked");
    console.log("Print component ref available:", !!componentRef.current);
    
    if (!componentRef.current) {
      console.error("Print component ref is not available!");
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
