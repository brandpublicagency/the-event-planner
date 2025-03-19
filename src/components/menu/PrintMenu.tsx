
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { useToast } from '@/components/ui/use-toast';
import { getVenueNames } from '@/utils/venueUtils';

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

  // Menu item descriptions mapping
  const menuItems: Record<string, string> = {
    // Starter Types
    'canapes': 'Canapés',
    'harvest': 'Harvest Table',
    'plated': 'Plated Starter',
    
    // Canapé Packages
    'standard': 'Standard Canapé Package',
    'premium': 'Premium Canapé Package',
    'deluxe': 'Deluxe Canapé Package',
    
    // Plated Starters
    'caprese_salad': 'Caprese Salad',
    'prawn_cocktail': 'Prawn Cocktail',
    'mushroom_soup': 'Creamy Mushroom Soup',
    'beetroot_carpaccio': 'Beetroot Carpaccio',
    
    // Main Course Types
    'buffet': 'Buffet Menu',
    'karoo': 'Warm Karoo Feast',
    'plated_main': 'Plated Menu',
    
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
    
    // Dessert Types
    'traditional': 'Traditional Baked Desserts',
    'individual': 'Individual Cakes',
    'bar': 'Dessert Bar',
    'canapes_dessert': 'Dessert Canapés',
    'cakes': 'Individual Cakes',
    
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
    'infused_water': 'Infused Water',
    'pink_lemonade': 'Pink Lemonade',
    'fruit_juice': 'Fruit Juice',
    'minty_mojito': 'Minty Mojito',
    'midnight_snack': 'Midnight Snack'
  };

  // Format descriptive name
  const getDisplayName = (key: string): string => {
    return menuItems[key] || key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format quantities to show only if greater than 1
  const formatQuantity = (quantity?: number): string => {
    if (!quantity || quantity <= 1) return '';
    return ` (x${quantity})`;
  };

  return (
    <div ref={ref} className="print-container p-8 max-w-[210mm] mx-auto">
      {/* Print header - removed the "MENU SELECTION" heading as requested */}
      <div className="text-center mb-6 print-header">
        <h2 className="text-lg font-medium">{event.name || 'Event'}</h2>
        <p className="text-sm text-gray-600">
          {formatDate(event.event_date)} | {event.pax} Guests | {getVenueNames(event)}
        </p>
      </div>

      <div className="menu-content">
        {/* Custom Menu */}
        {menuState.isCustomMenu ? (
          <section className="mb-6">
            <h3 className="text-md font-medium border-b pb-1 mb-3">Custom Menu</h3>
            <div className="whitespace-pre-line">
              {menuState.customMenuDetails || 'No custom menu details provided'}
            </div>
          </section>
        ) : (
          <>
            {/* Starter Section */}
            {menuState.selectedStarterType && (
              <section className="mb-6">
                <h3 className="text-md font-medium border-b pb-1 mb-3">Arrival & Starter</h3>
                <p className="font-medium">{getDisplayName(menuState.selectedStarterType)}</p>
                
                {menuState.selectedStarterType === 'canapes' && (
                  <div className="mt-2">
                    {menuState.selectedCanapePackage && (
                      <p className="mb-2">{getDisplayName(menuState.selectedCanapePackage)}</p>
                    )}
                    
                    {menuState.selectedCanapes && menuState.selectedCanapes.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {menuState.selectedCanapes.filter(Boolean).map((canape, idx) => (
                          <li key={idx} className="text-sm">{getDisplayName(canape)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm italic">No specific canapés selected</p>
                    )}
                  </div>
                )}
                
                {menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter && (
                  <p className="mt-1 text-sm">{getDisplayName(menuState.selectedPlatedStarter)}</p>
                )}
              </section>
            )}

            {/* Main Course Section */}
            {menuState.mainCourseType && (
              <section className="mb-6">
                <h3 className="text-md font-medium border-b pb-1 mb-3">Main Course</h3>
                <p className="font-medium">{getDisplayName(menuState.mainCourseType)}</p>
                
                {menuState.mainCourseType === 'buffet' && (
                  <div className="mt-2 space-y-3">
                    {menuState.buffetMeatSelections && menuState.buffetMeatSelections.length > 0 && (
                      <div>
                        <p className="font-medium text-sm">Meat</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {menuState.buffetMeatSelections.map((item, idx) => (
                            <li key={idx} className="text-sm">{getDisplayName(item)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {menuState.buffetStarchSelections && menuState.buffetStarchSelections.length > 0 && (
                      <div>
                        <p className="font-medium text-sm">Starch</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {menuState.buffetStarchSelections.map((item, idx) => (
                            <li key={idx} className="text-sm">{getDisplayName(item)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {menuState.buffetVegetableSelections && menuState.buffetVegetableSelections.length > 0 && (
                      <div>
                        <p className="font-medium text-sm">Vegetables</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {menuState.buffetVegetableSelections.map((item, idx) => (
                            <li key={idx} className="text-sm">{getDisplayName(item)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {menuState.buffetSaladSelection && (
                      <div>
                        <p className="font-medium text-sm">Salad</p>
                        <p className="text-sm">{getDisplayName(menuState.buffetSaladSelection)}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {menuState.mainCourseType === 'karoo' && (
                  <div className="mt-2 space-y-3">
                    {menuState.karooMeatSelection && (
                      <div>
                        <p className="font-medium text-sm">Meat</p>
                        <p className="text-sm">{getDisplayName(menuState.karooMeatSelection)}</p>
                      </div>
                    )}
                    
                    {menuState.karooStarchSelection && menuState.karooStarchSelection.length > 0 && (
                      <div>
                        <p className="font-medium text-sm">Starch</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {menuState.karooStarchSelection.map((item, idx) => (
                            <li key={idx} className="text-sm">{getDisplayName(item)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {menuState.karooVegetableSelections && menuState.karooVegetableSelections.length > 0 && (
                      <div>
                        <p className="font-medium text-sm">Vegetables</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {menuState.karooVegetableSelections.map((item, idx) => (
                            <li key={idx} className="text-sm">{getDisplayName(item)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {menuState.karooSaladSelection && (
                      <div>
                        <p className="font-medium text-sm">Salad</p>
                        <p className="text-sm">{getDisplayName(menuState.karooSaladSelection)}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {menuState.mainCourseType === 'plated' && (
                  <div className="mt-2 space-y-3">
                    {menuState.platedMainSelection && (
                      <div>
                        <p className="font-medium text-sm">Main Selection</p>
                        <p className="text-sm">{getDisplayName(menuState.platedMainSelection)}</p>
                      </div>
                    )}
                    
                    {menuState.platedSaladSelection && (
                      <div>
                        <p className="font-medium text-sm">Salad</p>
                        <p className="text-sm">{getDisplayName(menuState.platedSaladSelection)}</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Dessert Section - Fixed to properly display dessert types and quantities */}
            {menuState.dessertType && (
              <section className="mb-6">
                <h3 className="text-md font-medium border-b pb-1 mb-3">Dessert</h3>
                <p className="font-medium">{getDisplayName(menuState.dessertType)}</p>
                
                {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
                  <p className="mt-1 text-sm">{getDisplayName(menuState.traditionalDessert)}</p>
                )}
                
                {/* Fix for dessert canapés display */}
                {(menuState.dessertType === 'canapes' || menuState.dessertType === 'canapes_dessert') && 
                  menuState.dessertCanapes && menuState.dessertCanapes.length > 0 && (
                  <div className="mt-2">
                    <ul className="list-disc pl-5 space-y-1">
                      {menuState.dessertCanapes.map((item, idx) => (
                        <li key={idx} className="text-sm">{getDisplayName(item)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Fix for individual cakes display - support both 'individual' and 'cakes' types */}
                {(menuState.dessertType === 'individual' || menuState.dessertType === 'cakes') && 
                  menuState.individualCakes && menuState.individualCakes.length > 0 && (
                  <div className="mt-2">
                    <ul className="list-disc pl-5 space-y-1">
                      {menuState.individualCakes.map((item, idx) => {
                        const quantity = menuState.individual_cake_quantities[item] || 1;
                        return (
                          <li key={idx} className="text-sm">
                            {getDisplayName(item)}{formatQuantity(quantity)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Additional Options Section */}
            {menuState.otherSelections && menuState.otherSelections.length > 0 && (
              <section className="mb-6">
                <h3 className="text-md font-medium border-b pb-1 mb-3">Additional Options</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {menuState.otherSelections.map((option, idx) => {
                    const quantity = menuState.otherSelectionsQuantities[option] || 1;
                    return (
                      <li key={idx} className="text-sm">
                        {getDisplayName(option)}{formatQuantity(quantity)}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        )}

        {/* Notes Section */}
        {menuState.notes && (
          <section className="mb-6 border-t pt-4 mt-6">
            <h3 className="text-md font-medium mb-2">Additional Notes</h3>
            <div className="whitespace-pre-line text-sm">
              {menuState.notes}
            </div>
          </section>
        )}
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
