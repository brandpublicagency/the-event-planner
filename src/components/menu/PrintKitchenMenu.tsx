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
    'plated': 'Plated Starter',
    'harvest': 'Harvest Table',
    
    // Dessert Types
    'traditional': 'Traditional Baked Desserts',
    'canapes': 'Dessert Canapés',
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
      className="print-container bg-white p-6 max-w-[210mm]" 
      style={{ 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div className="print-header text-center mb-6">
        <h1 className="text-xl font-bold uppercase">MENU SELECTION</h1>
      </div>

      <div className="event-header mb-8">
        <h2 className="text-xl font-bold mb-2">{event.name} <span className="font-normal text-sm">{event.event_code}</span></h2>
        <p className="text-sm">
          {formatDate(event.event_date)}, {formatTimeDisplay(event.start_time, event.end_time)} / {event.pax} Guests / {getVenueNames()}
        </p>
        <div className="mt-2 border-t border-gray-200"></div>
      </div>

      {/* Custom Menu Section */}
      {menuState.isCustomMenu && (
        <div className="section mb-5">
          <h3 className="text-base font-semibold">Custom Menu</h3>
          <p className="text-sm whitespace-pre-line">{menuState.customMenuDetails}</p>
        </div>
      )}

      {/* Standard Menu */}
      {!menuState.isCustomMenu && (
        <>
          {/* Starter Section */}
          {menuState.selectedStarterType && (
            <div className="section mb-5">
              <h3 className="text-base font-semibold">Arrival & Starter</h3>
              {menuState.selectedStarterType === 'canapes' && (
                <>
                  <p className="text-sm font-medium">Canapé Package: {menuState.selectedCanapePackage}</p>
                  {menuState.selectedCanapes.length > 0 && (
                    <div className="ml-4 mt-2">
                      {menuState.selectedCanapes.map((canape, idx) => (
                        canape && <p key={idx} className="text-sm">• {getDescription(canape)}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
              {menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter && (
                <p className="text-sm ml-4">• {getDescription(menuState.selectedPlatedStarter)}</p>
              )}
            </div>
          )}

          {/* Main Course Section */}
          {menuState.mainCourseType && (
            <div className="section mb-5">
              <h3 className="text-base font-semibold">Main Course</h3>
              <p className="text-sm font-medium">{getDescription(menuState.mainCourseType)}</p>
              
              {/* Buffet details */}
              {menuState.mainCourseType === 'buffet' && (
                <div className="ml-4 mt-2">
                  {menuState.buffetMeatSelections.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Meat Selections:</p>
                      {menuState.buffetMeatSelections.map((item, idx) => (
                        <p key={idx} className="text-sm ml-2">• {getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetVegetableSelections.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Vegetable Selections:</p>
                      {menuState.buffetVegetableSelections.map((item, idx) => (
                        <p key={idx} className="text-sm ml-2">• {getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetStarchSelections.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Starch Selections:</p>
                      {menuState.buffetStarchSelections.map((item, idx) => (
                        <p key={idx} className="text-sm ml-2">• {getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetSaladSelection && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Salad Selection:</p>
                      <p className="text-sm ml-2">• {getDescription(menuState.buffetSaladSelection)}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Karoo Meat selection */}
              {menuState.mainCourseType === 'karoo' && (
                <div className="ml-4 mt-2">
                  {menuState.karooMeatSelection && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Meat Selection:</p>
                      <p className="text-sm ml-2">• {getDescription(menuState.karooMeatSelection)}</p>
                    </div>
                  )}
                  
                  {menuState.karooStarchSelection.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Starch Selections:</p>
                      {menuState.karooStarchSelection.map((item, idx) => (
                        <p key={idx} className="text-sm ml-2">• {getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.karooVegetableSelections.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Vegetable Selections:</p>
                      {menuState.karooVegetableSelections.map((item, idx) => (
                        <p key={idx} className="text-sm ml-2">• {getDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.karooSaladSelection && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Salad Selection:</p>
                      <p className="text-sm ml-2">• {getDescription(menuState.karooSaladSelection)}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Plated selections */}
              {menuState.mainCourseType === 'plated' && (
                <div className="ml-4 mt-2">
                  {menuState.platedMainSelection && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Main Selection:</p>
                      <p className="text-sm ml-2">• {getDescription(menuState.platedMainSelection)}</p>
                    </div>
                  )}
                  
                  {menuState.platedSaladSelection && (
                    <div className="mb-3">
                      <p className="text-sm font-medium">Salad Selection:</p>
                      <p className="text-sm ml-2">• {getDescription(menuState.platedSaladSelection)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dessert Section */}
          {menuState.dessertType && (
            <div className="section mb-5">
              <h3 className="text-base font-semibold">Dessert</h3>
              <p className="text-sm font-medium">{getDescription(menuState.dessertType)}</p>
              
              {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
                <p className="text-sm ml-4">• {getDescription(menuState.traditionalDessert)}</p>
              )}
              
              {menuState.dessertType === 'canapes' && menuState.dessertCanapes.length > 0 && (
                <div className="ml-4 mt-2">
                  {menuState.dessertCanapes.map((item, idx) => (
                    <p key={idx} className="text-sm">• {getDescription(item)}</p>
                  ))}
                </div>
              )}
              
              {menuState.dessertType === 'individual' && menuState.individualCakes.length > 0 && (
                <div className="ml-4 mt-2">
                  {menuState.individualCakes.map((item, idx) => {
                    const quantity = menuState.individual_cake_quantities[item] || 0;
                    return (
                      <p key={idx} className="text-sm">• {getDescription(item)} x {quantity}</p>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Additional Options Section */}
          {menuState.otherSelections && menuState.otherSelections.length > 0 && (
            <div className="section mb-5">
              <h3 className="text-base font-semibold">Additional Options</h3>
              <div className="ml-4 mt-2">
                {menuState.otherSelections.map((option, idx) => {
                  const quantity = menuState.otherSelectionsQuantities[option] || 0;
                  return (
                    <p key={idx} className="text-sm">• {getDescription(option)} x {quantity}</p>
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
        <div className="section mb-5">
          <h3 className="text-base font-semibold">Additional Notes</h3>
          <div className="ml-4 mt-2 whitespace-pre-line">
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
        margin: 10mm !important;
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
          padding: 10mm;
          margin: 0 !important;
          font-size: 12px;
        }
        h1 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        h2 {
          font-size: 16px;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        h3 {
          font-size: 14px;
          font-weight: bold;
          margin-top: 15px;
          margin-bottom: 8px;
        }
        p {
          font-size: 12px;
          margin-top: 0;
          margin-bottom: 4px;
          line-height: 1.4;
        }
        .section {
          margin-bottom: 15px;
        }
        hr {
          margin: 15px 0;
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