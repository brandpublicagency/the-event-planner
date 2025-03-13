import React, { useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { useToast } from '@/components/ui/use-toast';

// Define interface for the print props
interface PrintMenuProps {
  event: Event;
  menuState: MenuState;
}

// Component that will be printed
const KitchenMenuContent = React.forwardRef<HTMLDivElement, PrintMenuProps>(({ event, menuState }, ref) => {
  // Menu item descriptions mapping
  const menuItemDescriptions: Record<string, string> = {
    // Main Course Types
    'buffet': 'Buffet Menu',
    'karoo': 'Warm Karoo Feast',
    'plated': 'Plated Menu',
    
    // Starter Types
    'canapes': 'Canapés',
    'plated_starter': 'Plated Starter',
    'harvest': 'Harvest Table',
    
    // Dessert Types
    'traditional': 'Traditional Baked Desserts',
    'dessert_canapes': 'Dessert Canapés',
    'individual': 'Individual Cakes',
    'bar': 'Dessert Bar',
    
    // Main Course - Karoo Meat
    'lamb_chicken': 'Slow roasted leg of lamb and homemade chicken pie',
    'oxtail_chicken': 'Homemade oxtail pie and golden-brown chickens',
    
    // Main Course - Buffet Meat
    'chicken_pie': 'Homemade chicken pie',
    'chicken_thighs': 'Roasted lemon & herb chicken thighs with chimichurri',
    'leg_of_lamb': 'Leg of lamb with a rich jus',
    'beef_fillet': 'Beef fillet medallions in creamy wild mushroom sauce',
    'oxtail_pie': 'Slow roasted oxtail pie',
    'glazed_gammon': 'Glazed gammon with sticky mustard & apple sauce',
    
    // Main Course - Plated Options
    'lamb_shank': 'Fall-off-the-bone lamb shank with demi-glace and creamy mashed potato served with crisp broccoli stems and honey-roasted carrots',
    'beef_cut': 'Chef\'s cut of beef, whole green beans and potatoes wedges roasted in duck fat with parmesan & thyme. Served with mushroom or pepper sauce',
    'chicken_breast': 'Sun-dried tomato & feta-stuffed chicken breast in a basil cream sauce with mediterranean couscous & seasonal roast vegetables',
    
    // Starch
    'roast_potatoes': 'Traditional roast potatoes',
    'wedges': 'Parmesan roasted potato wedges',
    'basmati': 'Basmati rice',
    'pepper_rice': 'Mixed pepper-flavoured basmati rice',
    'baby_potatoes': 'Baby potatoes in garlic & rosemary butter',
    'potato_mash': 'Buttery potato mash',
    'polenta': 'Creamy polenta',
    'wild_rice': 'White or brown wild rice with fresh herbs',
    'couscous': 'Mediterranean couscous',
    'bulgur': 'Bulgur wheat',
    
    // Vegetables
    'green_beans': 'Green beans with butter & cream',
    'sweet_potatoes': 'Traditional caramelised sweet potatoes',
    'cauliflower': 'Cauliflower and cheese sauce',
    'pumpkin': 'Pumpkin fritters in a sweet caramel custard',
    'seasonal_veg': 'Seasonal roast vegetables',
    'creamed_beans': 'Creamed green beans with potato and bacon',
    'sweet_potato_bake': 'Sweet potato bake with an almond & coconut crust',
    'spinach_tart': 'Creamed spinach tart',
    'cauliflower_gratin': 'Cheesy cauliflower & parmesan gratin',
    
    // Salads
    'asian_coleslaw': 'Asian coleslaw with sesame dressing',
    'caprese': 'Caprese salad (tomato, mozzarella, basil)',
    'broccoli_bacon': 'Creamy broccoli & bacon salad',
    'halloumi_grape': 'Grilled halloumi and grape salad',
    'mixed_green': 'Mixed green leaves with a mustard vinaigrette dressing',
    'strawberry_beetroot': 'Strawberry, beetroot & pecan nut salad with balsamic glaze',
    'greek': 'Traditional greek salad',
    'beetroot': 'Traditional pickled baby beetroot salad',
    'watermelon_feta': 'Watermelon, feta & mint salad',
    
    // Traditional Desserts
    'chocolate_pudding': 'Self-saucing chocolate pudding',
    'date_pudding': 'Date & nut brandy pudding',
    'malva_pudding': 'Traditional malva pudding',
    'apple_pudding': 'Baked apple caramel pudding',
    'almond_pudding': 'Baked almond pudding with citrus & cinnamon syrup',
    
    // Individual Cakes
    'cheesecake': 'Baked cheesecake',
    'pavlova': 'Lemon curd and berry pavlova',
    'chocolate_cake': 'Rich chocolate cake with dark chocolate ganache',
    'carrot_cake': 'Carrot cake with cream cheese frosting',
    'lemon_cake': 'Lemon & poppyseed cake with cream and mascarpone',
    
    // Additional options
    'infused_water': 'Infused Water (7L)',
    'pink_lemonade': 'Pink Lemonade (7L)',
    'fruit_juice': 'Fruit Juice (7L)',
    'minty_mojito': 'Minty Mojito (7L)',
    'midnight_snack': 'Midnight Snack'
  };

  // Helper function to get readable description
  const getDescription = (code: string): string => {
    return menuItemDescriptions[code] || code;
  };

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
    
    return `${formattedStart} - ${formattedEnd}`;
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
      <p key={i} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{line}</p>
    ));
  };
  
  // Get formatted event details in one line
  const getEventDetailsLine = () => {
    const date = formatDate(event.event_date);
    const time = formatTimeDisplay(event.start_time, event.end_time);
    const guests = `${event.pax || 0} Guests`;
    const eventType = event.event_type || '';
    const packageInfo = (event as any).package_id ? `Package ${(event as any).package_id}` : '';
    const venueNames = getVenueNames();
    
    return `${date}, ${time} / ${guests} / ${eventType}${packageInfo ? ' / ' + packageInfo : ''}`;
  };

  return (
    <div 
      ref={ref} 
      className="print-container bg-white p-6" 
      style={{ 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        width: '210mm',
        textAlign: 'left',
      }}
    >
      <div className="print-header" style={{ marginBottom: '16px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 'normal', marginBottom: '16px' }}>MENU SELECTION</h1>
      </div>

      <div className="event-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
          {event.name} <span style={{ fontWeight: 'normal', fontSize: '10px' }}>{event.event_code}</span>
        </h2>
        <p style={{ fontSize: '12px', margin: '0' }}>
          {getEventDetailsLine()}
        </p>
        <div style={{ marginTop: '16px', borderTop: '1px solid #ddd' }}></div>
      </div>

      {/* Custom Menu Section */}
      {menuState.isCustomMenu && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Custom Menu</h3>
          <p style={{ fontSize: '12px', whiteSpace: 'pre-line', margin: '0' }}>{menuState.customMenuDetails}</p>
        </div>
      )}

      {/* Standard Menu */}
      {!menuState.isCustomMenu && (
        <>
          {/* Starter Section */}
          {menuState.selectedStarterType && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Arrival & Starter</h3>
              {menuState.selectedStarterType === 'canapes' && (
                <>
                  <p style={{ fontSize: '12px', marginBottom: '4px' }}>Canapé Package: {menuState.selectedCanapePackage}</p>
                  {menuState.selectedCanapes.length > 0 && (
                    <div>
                      {menuState.selectedCanapes.map((canape, idx) => (
                        canape && <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(canape)}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
              {menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter && (
                <p style={{ fontSize: '12px', margin: '0' }}>{getDescription(menuState.selectedPlatedStarter)}</p>
              )}
            </div>
          )}

          {/* Main Course Section */}
          {menuState.mainCourseType && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Main Course</h3>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '8px' }}>{getDescription(menuState.mainCourseType)}</p>
              
              {/* Buffet details */}
              {menuState.mainCourseType === 'buffet' && (
                <div>
                  {menuState.buffetMeatSelections.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Meat Selections:</p>
                      {menuState.buffetMeatSelections.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetVegetableSelections.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
                      {menuState.buffetVegetableSelections.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetStarchSelections.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
                      {menuState.buffetStarchSelections.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetSaladSelection && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
                      <p style={{ fontSize: '12px', margin: '0' }}>{getDescription(menuState.buffetSaladSelection)}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Karoo Meat selection */}
              {menuState.mainCourseType === 'karoo' && (
                <div>
                  {menuState.karooMeatSelection && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Meat Selection:</p>
                      <p style={{ fontSize: '12px', margin: '0' }}>{getDescription(menuState.karooMeatSelection)}</p>
                    </div>
                  )}
                  
                  {menuState.karooStarchSelection.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
                      {menuState.karooStarchSelection.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.karooVegetableSelections.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
                      {menuState.karooVegetableSelections.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.karooSaladSelection && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
                      <p style={{ fontSize: '12px', margin: '0' }}>{getDescription(menuState.karooSaladSelection)}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Plated selections */}
              {menuState.mainCourseType === 'plated' && (
                <div>
                  {menuState.platedMainSelection && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Main Selection:</p>
                      <p style={{ fontSize: '12px', margin: '0' }}>{getDescription(menuState.platedMainSelection)}</p>
                    </div>
                  )}
                  
                  {menuState.platedSaladSelection && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
                      <p style={{ fontSize: '12px', margin: '0' }}>{getDescription(menuState.platedSaladSelection)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dessert Section */}
          {menuState.dessertType && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Dessert</h3>
              <p style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(menuState.dessertType)}</p>
              
              {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
                <p style={{ fontSize: '12px', margin: '0' }}>{getDescription(menuState.traditionalDessert)}</p>
              )}
              
              {menuState.dessertType === 'canapes' && menuState.dessertCanapes.length > 0 && (
                <div>
                  {menuState.dessertCanapes.map((item, idx) => (
                    <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(item)}</p>
                  ))}
                </div>
              )}
              
              {menuState.dessertType === 'individual' && menuState.individualCakes.length > 0 && (
                <div>
                  {menuState.individualCakes.map((item, idx) => {
                    const quantity = menuState.individual_cake_quantities[item] || 0;
                    return (
                      <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(item)} x {quantity}</p>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Additional Options Section */}
          {menuState.otherSelections && menuState.otherSelections.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Additional Options</h3>
              <div>
                {menuState.otherSelections.map((option, idx) => {
                  const quantity = menuState.otherSelectionsQuantities[option] || 0;
                  return (
                    <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getDescription(option)} x {quantity}</p>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Divider */}
      <hr style={{ margin: '16px 0', borderColor: '#ddd' }} />

      {/* Notes Section */}
      {menuState.notes && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Additional Notes</h3>
          <div style={{ whiteSpace: 'pre-line' }}>
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
        h2 span {
          font-size: 10px;
          font-weight: normal;
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

