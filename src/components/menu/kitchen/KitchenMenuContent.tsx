import React from 'react';
import { format, parseISO } from 'date-fns';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { getVenueNames } from '@/utils/venueUtils';

// Define interface for the print props
interface KitchenMenuContentProps {
  event: Event;
  menuState: MenuState;
}

// Component that will be printed
const KitchenMenuContent = React.forwardRef<HTMLDivElement, KitchenMenuContentProps>(({ event, menuState }, ref) => {
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

  // Format notes
  const formatNotes = (notes: string) => {
    return notes.split('\n').map((line, i) => (
      <p key={i} className="menu-item">{line}</p>
    ));
  };

  // Get menu item description
  const getMenuItemDescription = (code: string, descriptions: Record<string, string>) => {
    return descriptions[code] || code;
  };

  // Menu item descriptions mapping
  const menuItemDescriptions: Record<string, string> = {
    // Main Course Types
    'buffet': 'Buffet Menu',
    'karoo': 'Warm Karoo Feast',
    'plated': 'Plated Menu',
    
    // Starter Types
    'canapes': 'Canapés',
    'harvest': 'Harvest Table',
    
    // Dessert Types
    'traditional': 'Traditional Baked Desserts',
    'individual': 'Individual Cakes',
    'bar': 'Dessert Bar',
    
    // Main Course - Karoo Meat
    'lamb_chicken': 'Slow roasted leg of lamb and homemade chicken pie',
    'oxtail_chicken': 'Homemade oxtail pie and golden-brown chickens',
    
    // Main Course - Buffet Meat
    'chicken_pie': 'Homemade chicken pie',
    'chicken_thighs': 'Roasted lemon & herb chicken thighs with chimichurri',
    'lamb_leg': 'Leg of lamb with a rich jus',
    'beef_fillet': 'Beef fillet medallions in creamy wild mushroom sauce',
    'oxtail_pie': 'Slow roasted oxtail pie',
    'glazed_gammon': 'Glazed gammon with sticky mustard & apple sauce',
    
    // Main Course - Plated Options
    'lamb_shank': 'Fall-off-the-bone lamb shank with demi-glace and creamy mashed potato served with crisp broccoli stems and honey-roasted carrots',
    'beef_cut': "Chef's cut of beef, whole green beans and potatoes wedges roasted in duck fat with parmesan & thyme. Served with mushroom or pepper sauce",
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
    'pumpkin_fritters': 'Pumpkin fritters in a sweet caramel custard',
    'seasonal_veg': 'Seasonal roast vegetables',
    'creamed_beans': 'Creamed green beans with potato and bacon',
    'sweet_potato': 'Sweet potato bake with an almond & coconut crust',
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
    'watermelon': 'Watermelon, feta & mint salad',
    
    // Traditional Desserts
    'chocolate_pudding': 'Self-saucing chocolate pudding',
    'brandy_pudding': 'Date & nut brandy pudding',
    'malva_pudding': 'Traditional malva pudding',
    'apple_pudding': 'Baked apple caramel pudding',
    'almond_pudding': 'Baked almond pudding with citrus & cinnamon syrup',
    
    // Individual Cakes
    'cheesecake': 'Baked cheesecake',
    'pavlova_cake': 'Lemon curd and berry pavlova',
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

  // Get venue names
  const venueNames = getVenueNames(event);

  return (
    <div 
      ref={ref} 
      className="print-container"
    >
      <div className="print-header">
        <h2>{event.name}</h2>
        <p>
          {formatDate(event.event_date)}, {formatTimeDisplay(event.start_time, event.end_time)} / {event.pax} Guests / {event.event_type || 'Event'} / {venueNames}
        </p>
        {/* The header divider is added via CSS ::after */}
      </div>

      {/* Custom Menu Section */}
      {menuState.isCustomMenu ? (
        <div>
          <div className="section-header">CUSTOM MENU:</div>
          <div className="menu-content">
            <p className="menu-item">{menuState.customMenuDetails}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Starter Section */}
          {menuState.selectedStarterType && (
            <div>
              <div className="section-header">ARRIVAL & STARTER:</div>
              <div className="menu-content">
                {menuState.selectedStarterType === 'canapes' && (
                  <>
                    <p className="menu-item">{getMenuItemDescription('canapes', menuItemDescriptions)}</p>
                    {menuState.selectedCanapes.map((canape, idx) => (
                      canape && <p key={idx} className="menu-item">• {getMenuItemDescription(canape, menuItemDescriptions)}</p>
                    ))}
                  </>
                )}
                {menuState.selectedStarterType === 'harvest' && (
                  <p className="menu-item">{getMenuItemDescription('harvest', menuItemDescriptions)}</p>
                )}
                {menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter && (
                  <p className="menu-item">{getMenuItemDescription(menuState.selectedPlatedStarter, menuItemDescriptions)}</p>
                )}
              </div>
            </div>
          )}

          {/* Main Course Section */}
          {menuState.mainCourseType && (
            <div>
              <div className="section-header">MAIN COURSE:</div>
              <div className="menu-content">
                <p className="menu-item">{getMenuItemDescription(menuState.mainCourseType, menuItemDescriptions)}</p>
                
                {/* Buffet details */}
                {menuState.mainCourseType === 'buffet' && (
                  <>
                    {menuState.buffetMeatSelections.length > 0 && (
                      <>
                        <p className="category-label">Meat Selections:</p>
                        {menuState.buffetMeatSelections.map((item, idx) => (
                          <p key={idx} className="menu-item">• {getMenuItemDescription(item, menuItemDescriptions)}</p>
                        ))}
                      </>
                    )}
                    
                    {menuState.buffetVegetableSelections.length > 0 && (
                      <>
                        <p className="category-label">Vegetable Selections:</p>
                        {menuState.buffetVegetableSelections.map((item, idx) => (
                          <p key={idx} className="menu-item">• {getMenuItemDescription(item, menuItemDescriptions)}</p>
                        ))}
                      </>
                    )}
                    
                    {menuState.buffetStarchSelections.length > 0 && (
                      <>
                        <p className="category-label">Starch Selections:</p>
                        {menuState.buffetStarchSelections.map((item, idx) => (
                          <p key={idx} className="menu-item">• {getMenuItemDescription(item, menuItemDescriptions)}</p>
                        ))}
                      </>
                    )}
                    
                    {menuState.buffetSaladSelection && (
                      <>
                        <p className="category-label">Salad Selection:</p>
                        <p className="menu-item">• {getMenuItemDescription(menuState.buffetSaladSelection, menuItemDescriptions)}</p>
                      </>
                    )}
                  </>
                )}
                
                {/* Karoo Meat selection */}
                {menuState.mainCourseType === 'karoo' && (
                  <>
                    {menuState.karooMeatSelection && (
                      <>
                        <p className="category-label">Meat Selection:</p>
                        <p className="menu-item">• {getMenuItemDescription(menuState.karooMeatSelection, menuItemDescriptions)}</p>
                      </>
                    )}
                    
                    {menuState.karooStarchSelection && menuState.karooStarchSelection.length > 0 && (
                      <>
                        <p className="category-label">Starch Selections:</p>
                        {menuState.karooStarchSelection.map((item, idx) => (
                          <p key={idx} className="menu-item">• {getMenuItemDescription(item, menuItemDescriptions)}</p>
                        ))}
                      </>
                    )}
                    
                    {menuState.karooVegetableSelections && menuState.karooVegetableSelections.length > 0 && (
                      <>
                        <p className="category-label">Vegetable Selections:</p>
                        {menuState.karooVegetableSelections.map((item, idx) => (
                          <p key={idx} className="menu-item">• {getMenuItemDescription(item, menuItemDescriptions)}</p>
                        ))}
                      </>
                    )}
                    
                    {menuState.karooSaladSelection && (
                      <>
                        <p className="category-label">Salad Selection:</p>
                        <p className="menu-item">• {getMenuItemDescription(menuState.karooSaladSelection, menuItemDescriptions)}</p>
                      </>
                    )}
                  </>
                )}
                
                {/* Plated selections */}
                {menuState.mainCourseType === 'plated' && (
                  <>
                    {menuState.platedMainSelection && (
                      <>
                        <p className="category-label">Main Selection:</p>
                        <p className="menu-item">• {getMenuItemDescription(menuState.platedMainSelection, menuItemDescriptions)}</p>
                      </>
                    )}
                    
                    {menuState.platedSaladSelection && (
                      <>
                        <p className="category-label">Salad Selection:</p>
                        <p className="menu-item">• {getMenuItemDescription(menuState.platedSaladSelection, menuItemDescriptions)}</p>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Dessert Section */}
          {menuState.dessertType && (
            <div>
              <div className="section-header">DESSERT:</div>
              <div className="menu-content">
                <p className="menu-item">{getMenuItemDescription(menuState.dessertType, menuItemDescriptions)}</p>
                
                {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
                  <p className="menu-item">• {getMenuItemDescription(menuState.traditionalDessert, menuItemDescriptions)}</p>
                )}
                
                {menuState.dessertType === 'canapes' && menuState.dessertCanapes && menuState.dessertCanapes.length > 0 && (
                  menuState.dessertCanapes.map((item, idx) => (
                    <p key={idx} className="menu-item">• {getMenuItemDescription(item, menuItemDescriptions)}</p>
                  ))
                )}
                
                {menuState.dessertType === 'cakes' && menuState.individualCakes && menuState.individualCakes.length > 0 && (
                  menuState.individualCakes.map((item, idx) => {
                    const quantity = menuState.individual_cake_quantities?.[item] || 0;
                    return (
                      <p key={idx} className="menu-item">• {getMenuItemDescription(item, menuItemDescriptions)} x {quantity}</p>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Additional Options Section */}
          {menuState.otherSelections && menuState.otherSelections.length > 0 && (
            <div>
              <div className="section-header">ADDITIONAL OPTIONS:</div>
              <div className="menu-content">
                {menuState.otherSelections.map((option, idx) => {
                  const quantity = menuState.otherSelectionsQuantities?.[option] || 0;
                  return (
                    <p key={idx} className="menu-item">• {getMenuItemDescription(option, menuItemDescriptions)} x {quantity}</p>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Notes Section */}
      {menuState.notes && (
        <div>
          <div className="section-header">ADDITIONAL NOTES:</div>
          <div className="menu-content">
            {formatNotes(menuState.notes)}
          </div>
        </div>
      )}
    </div>
  );
});

KitchenMenuContent.displayName = 'KitchenMenuContent';

export default KitchenMenuContent;          <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Additional Notes</h3>
          <div style={{ whiteSpace: 'pre-line' }}>
            {formatNotes(menuState.notes)}
          </div>
        </div>
      )}
    </div>
  );
});

// Helper function for starter section
const renderStarterSection = (menuState: MenuState) => {
  if (!menuState.selectedStarterType) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Arrival & Starter</h3>
      {menuState.selectedStarterType === 'canapes' && (
        <>
          <p style={{ fontSize: '12px', marginBottom: '4px' }}>Canapé Package: {menuState.selectedCanapePackage}</p>
          {menuState.selectedCanapes.length > 0 && (
            <div>
              {menuState.selectedCanapes.map((canape, idx) => (
                canape && <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
                  {getMenuItemDescription(canape, menuItemDescriptions)}
                </p>
              ))}
            </div>
          )}
        </>
      )}
      {menuState.selectedStarterType === 'harvest' && (
        <p style={{ fontSize: '12px', margin: '0' }}>
          {getMenuItemDescription('harvest', menuItemDescriptions)}
        </p>
      )}
      {menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter && (
        <p style={{ fontSize: '12px', margin: '0' }}>
          {getMenuItemDescription(menuState.selectedPlatedStarter, menuItemDescriptions)}
        </p>
      )}
    </div>
  );
};

// Helper function for main course section
const renderMainCourseSection = (menuState: MenuState) => {
  if (!menuState.mainCourseType) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Main Course</h3>
      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '8px' }}>
        {getMenuItemDescription(menuState.mainCourseType, menuItemDescriptions)}
      </p>
      
      {/* Buffet details */}
      {menuState.mainCourseType === 'buffet' && (
        <div>
          {menuState.buffetMeatSelections.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Meat Selections:</p>
              {menuState.buffetMeatSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
                  {getMenuItemDescription(item, menuItemDescriptions)}
                </p>
              ))}
            </div>
          )}
          
          {menuState.buffetVegetableSelections.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
              {menuState.buffetVegetableSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
                  {getMenuItemDescription(item, menuItemDescriptions)}
                </p>
              ))}
            </div>
          )}
          
          {menuState.buffetStarchSelections.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
              {menuState.buffetStarchSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
                  {getMenuItemDescription(item, menuItemDescriptions)}
                </p>
              ))}
            </div>
          )}
          
          {menuState.buffetSaladSelection && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
              <p style={{ fontSize: '12px', margin: '0' }}>
                {getMenuItemDescription(menuState.buffetSaladSelection, menuItemDescriptions)}
              </p>
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
              <p style={{ fontSize: '12px', margin: '0' }}>
                {getMenuItemDescription(menuState.karooMeatSelection, menuItemDescriptions)}
              </p>
            </div>
          )}
          
          {menuState.karooStarchSelection.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
              {menuState.karooStarchSelection.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
                  {getMenuItemDescription(item, menuItemDescriptions)}
                </p>
              ))}
            </div>
          )}
          
          {menuState.karooVegetableSelections.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
              {menuState.karooVegetableSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
                  {getMenuItemDescription(item, menuItemDescriptions)}
                </p>
              ))}
            </div>
          )}
          
          {menuState.karooSaladSelection && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
              <p style={{ fontSize: '12px', margin: '0' }}>
                {getMenuItemDescription(menuState.karooSaladSelection, menuItemDescriptions)}
              </p>
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
              <p style={{ fontSize: '12px', margin: '0' }}>
                {getMenuItemDescription(menuState.platedMainSelection, menuItemDescriptions)}
              </p>
            </div>
          )}
          
          {menuState.platedSaladSelection && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
              <p style={{ fontSize: '12px', margin: '0' }}>
                {getMenuItemDescription(menuState.platedSaladSelection, menuItemDescriptions)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function for dessert section
const renderDessertSection = (menuState: MenuState) => {
  if (!menuState.dessertType) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Dessert</h3>
      <p style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
        {getMenuItemDescription(menuState.dessertType, menuItemDescriptions)}
      </p>
      
      {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
        <p style={{ fontSize: '12px', margin: '0' }}>
          {getMenuItemDescription(menuState.traditionalDessert, menuItemDescriptions)}
        </p>
      )}
      
      {menuState.dessertType === 'bar' && menuState.dessertCanapes.length > 0 && (
        <div>
          {menuState.dessertCanapes.map((item, idx) => (
            <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
              {getMenuItemDescription(item, menuItemDescriptions)}
            </p>
          ))}
        </div>
      )}
      
      {menuState.dessertType === 'individual' && menuState.individualCakes.length > 0 && (
        <div>
          {menuState.individualCakes.map((item, idx) => {
            const quantity = menuState.individual_cake_quantities[item] || 0;
            return (
              <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
                {getMenuItemDescription(item, menuItemDescriptions)} x {quantity}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function for additional options section
const renderAdditionalOptionsSection = (menuState: MenuState) => {
  if (!menuState.otherSelections || menuState.otherSelections.length === 0) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Additional Options</h3>
      <div>
        {menuState.otherSelections.map((option, idx) => {
          const quantity = menuState.otherSelectionsQuantities[option] || 0;
          return (
            <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
              {getMenuItemDescription(option, menuItemDescriptions)} x {quantity}
            </p>
          );
        })}
      </div>
    </div>
  );
};

KitchenMenuContent.displayName = 'KitchenMenuContent';

export default KitchenMenuContent;
