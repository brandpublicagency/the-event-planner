
import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';

// Define interface for the print props
interface PrintMenuProps {
  event: Event;
  menuState: MenuState;
}

// Component that will be printed
const KitchenMenuContent = React.forwardRef<HTMLDivElement, PrintMenuProps>(({ event, menuState }, ref) => {
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    return format(new Date(dateString), 'dd MMMM yyyy');
  };

  // Format time 
  const formatTimeDisplay = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return '';
    
    const formattedStart = format(parseISO(`2000-01-01T${startTime}`), 'HH:mm');
    const formattedEnd = format(parseISO(`2000-01-01T${endTime}`), 'HH:mm');
    
    return `${formattedStart} to ${formattedEnd}`;
  };

  // Helper to get venue names
  const getVenueNames = () => {
    if (!event.event_venues) return '';
    
    return event.event_venues
      .map(ev => ev.venues?.name)
      .filter(Boolean)
      .join(', ');
  };

  // Format notes
  const formatNotes = (notes: string) => {
    return notes.split('\n').map((line, i) => (
      <p key={i} className="text-sm">{line}</p>
    ));
  };

  return (
    <div 
      ref={ref} 
      className="print-container bg-white p-3 max-w-[210mm]" 
      style={{ 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div className="print-header text-center mb-4">
        <h1 className="text-base font-bold uppercase">MENU SELECTION</h1>
      </div>

      <div className="event-header mb-6">
        <h2 className="text-xl font-bold mb-1">{event.name} <span className="font-normal text-sm">{event.event_code}</span></h2>
        <p className="text-sm">
          {formatDate(event.event_date)}, {formatTimeDisplay(event.start_time, event.end_time)} / {event.pax} Guests / {getVenueNames()}
        </p>
      </div>

      {/* Custom Menu Section */}
      {menuState.isCustomMenu && (
        <div className="section mb-4">
          <h3 className="text-base font-semibold">Custom Menu</h3>
          <p className="text-sm whitespace-pre-line">{menuState.customMenuDetails}</p>
        </div>
      )}

      {/* Standard Menu */}
      {!menuState.isCustomMenu && (
        <>
          {/* Starter Section */}
          {menuState.selectedStarterType && (
            <div className="section mb-4">
              <h3 className="text-base font-semibold">Arrival & Starter</h3>
              {menuState.selectedStarterType === 'canapes' && (
                <>
                  <p className="text-sm font-medium">Canapé Package: {menuState.selectedCanapePackage}</p>
                  {menuState.selectedCanapes.length > 0 && (
                    <div className="ml-4 mt-1">
                      {menuState.selectedCanapes.map((canape, idx) => (
                        canape && <p key={idx} className="text-sm">• {canape}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
              {menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter && (
                <p className="text-sm">Plated Starter: {menuState.selectedPlatedStarter}</p>
              )}
            </div>
          )}

          {/* Main Course Section */}
          {menuState.mainCourseType && (
            <div className="section mb-4">
              <h3 className="text-base font-semibold">Main Course</h3>
              <p className="text-sm font-medium">{menuState.mainCourseType}</p>
              
              {/* Buffet details */}
              {menuState.mainCourseType === 'buffet' && (
                <div className="ml-4 mt-1">
                  {menuState.buffetMeatSelections.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Meat Selections:</p>
                      {menuState.buffetMeatSelections.map((item, idx) => (
                        <p key={idx} className="text-sm">• {item}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetVegetableSelections.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Vegetable Selections:</p>
                      {menuState.buffetVegetableSelections.map((item, idx) => (
                        <p key={idx} className="text-sm">• {item}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetStarchSelections.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Starch Selections:</p>
                      {menuState.buffetStarchSelections.map((item, idx) => (
                        <p key={idx} className="text-sm">• {item}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetSaladSelection && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Salad Selection:</p>
                      <p className="text-sm">• {menuState.buffetSaladSelection}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Karoo Meat selection */}
              {menuState.mainCourseType === 'karoo' && (
                <div className="ml-4 mt-1">
                  {menuState.karooMeatSelection && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Meat Selection:</p>
                      <p className="text-sm">• {menuState.karooMeatSelection}</p>
                    </div>
                  )}
                  
                  {menuState.karooStarchSelection.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Starch Selections:</p>
                      {menuState.karooStarchSelection.map((item, idx) => (
                        <p key={idx} className="text-sm">• {item}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.karooVegetableSelections.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Vegetable Selections:</p>
                      {menuState.karooVegetableSelections.map((item, idx) => (
                        <p key={idx} className="text-sm">• {item}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.karooSaladSelection && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Salad Selection:</p>
                      <p className="text-sm">• {menuState.karooSaladSelection}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Plated selections */}
              {menuState.mainCourseType === 'plated' && (
                <div className="ml-4 mt-1">
                  {menuState.platedMainSelection && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Main Selection:</p>
                      <p className="text-sm">• {menuState.platedMainSelection}</p>
                    </div>
                  )}
                  
                  {menuState.platedSaladSelection && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Salad Selection:</p>
                      <p className="text-sm">• {menuState.platedSaladSelection}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dessert Section */}
          {menuState.dessertType && (
            <div className="section mb-4">
              <h3 className="text-base font-semibold">Dessert</h3>
              <p className="text-sm font-medium">{menuState.dessertType}</p>
              
              {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
                <p className="text-sm ml-4">• {menuState.traditionalDessert}</p>
              )}
              
              {menuState.dessertType === 'canapes' && menuState.dessertCanapes.length > 0 && (
                <div className="ml-4 mt-1">
                  {menuState.dessertCanapes.map((item, idx) => (
                    <p key={idx} className="text-sm">• {item}</p>
                  ))}
                </div>
              )}
              
              {menuState.dessertType === 'individual' && menuState.individualCakes.length > 0 && (
                <div className="ml-4 mt-1">
                  {menuState.individualCakes.map((item, idx) => {
                    const quantity = menuState.individual_cake_quantities[item] || 0;
                    return (
                      <p key={idx} className="text-sm">• {item} x {quantity}</p>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Additional Options Section */}
          {menuState.otherSelections && menuState.otherSelections.length > 0 && (
            <div className="section mb-4">
              <h3 className="text-base font-semibold">Additional Options</h3>
              <div className="ml-4 mt-1">
                {menuState.otherSelections.map((option, idx) => {
                  const quantity = menuState.otherSelectionsQuantities[option] || 0;
                  return (
                    <p key={idx} className="text-sm">• {option} x {quantity}</p>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Divider */}
      <hr className="my-6 border-gray-300" />

      {/* Notes Section */}
      {menuState.notes && (
        <div className="section mb-4">
          <h3 className="text-base font-semibold">Additional Notes</h3>
          <div className="ml-4 mt-1 whitespace-pre-line">
            {formatNotes(menuState.notes)}
          </div>
        </div>
      )}
    </div>
  );
});

KitchenMenuContent.displayName = 'KitchenMenuContent';

// Print button component
export const PrintKitchenMenu: React.FC<PrintMenuProps> = ({ event, menuState }) => {
  const componentRef = React.useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Kitchen Menu - ${event.name}`,
    onBeforePrint: () => {
      console.log("Preparing to print...");
      return Promise.resolve(); // Return a Promise to satisfy TypeScript
    },
    onAfterPrint: () => {
      console.log("Print completed or canceled");
      return Promise.resolve(); // Return a Promise for consistency
    },
    removeAfterPrint: false,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.8mm !important;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
        .print-container {
          width: 210mm;
          height: 297mm;
          padding: 3mm;
          margin: 0 !important;
          font-size: 13px;
        }
        h1, h2, h3, h4, h5, h6 {
          font-size: 16px;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        p {
          font-size: 13px;
          margin-top: 0;
          margin-bottom: 5px;
        }
      }
    `,
  });

  // Correctly type the handler function
  const onPrintClick = () => {
    console.log("Print button clicked, component ref:", componentRef.current);
    if (componentRef.current) {
      handlePrint();
    }
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
      <div style={{ display: "none" }}>
        <KitchenMenuContent ref={componentRef} event={event} menuState={menuState} />
      </div>
    </>
  );
};
