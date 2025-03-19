
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { getVenueNames } from '@/utils/venueUtils';
import { getMenuItemDescription } from '@/utils/menu/menuItemDescriptions';

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

  // Get venue names using the utility function
  const venueNames = getVenueNames(event);

  // Format notes
  const formatNotes = (notes: string) => {
    return notes.split('\n').map((line, i) => (
      <p key={i} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{line}</p>
    ));
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
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{event.name}</h2>
        <p style={{ fontSize: '12px', margin: '0' }}>
          {formatDate(event.event_date)}, {formatTimeDisplay(event.start_time, event.end_time)} / {event.pax} Guests / {event.event_type || 'Private Event'} / {venueNames}
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
                        canape && <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(canape)}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
              {menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter && (
                <p style={{ fontSize: '12px', margin: '0' }}>{getMenuItemDescription(menuState.selectedPlatedStarter)}</p>
              )}
              {menuState.selectedStarterType === 'harvest' && (
                <p style={{ fontSize: '12px', margin: '0' }}>Harvest Table</p>
              )}
            </div>
          )}

          {/* Main Course Section */}
          {menuState.mainCourseType && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Main Course</h3>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '8px' }}>{getMenuItemDescription(menuState.mainCourseType)}</p>
              
              {/* Buffet details */}
              {menuState.mainCourseType === 'buffet' && (
                <div>
                  {menuState.buffetMeatSelections.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Meat Selections:</p>
                      {menuState.buffetMeatSelections.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetVegetableSelections.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
                      {menuState.buffetVegetableSelections.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetStarchSelections.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
                      {menuState.buffetStarchSelections.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.buffetSaladSelection && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
                      <p style={{ fontSize: '12px', margin: '0' }}>{getMenuItemDescription(menuState.buffetSaladSelection)}</p>
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
                      <p style={{ fontSize: '12px', margin: '0' }}>{getMenuItemDescription(menuState.karooMeatSelection)}</p>
                    </div>
                  )}
                  
                  {menuState.karooStarchSelection?.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
                      {menuState.karooStarchSelection.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.karooVegetableSelections?.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
                      {menuState.karooVegetableSelections.map((item, idx) => (
                        <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(item)}</p>
                      ))}
                    </div>
                  )}
                  
                  {menuState.karooSaladSelection && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
                      <p style={{ fontSize: '12px', margin: '0' }}>{getMenuItemDescription(menuState.karooSaladSelection)}</p>
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
                      <p style={{ fontSize: '12px', margin: '0' }}>{getMenuItemDescription(menuState.platedMainSelection)}</p>
                    </div>
                  )}
                  
                  {menuState.platedSaladSelection && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
                      <p style={{ fontSize: '12px', margin: '0' }}>{getMenuItemDescription(menuState.platedSaladSelection)}</p>
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
              <p style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(menuState.dessertType)}</p>
              
              {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
                <p style={{ fontSize: '12px', margin: '0' }}>{getMenuItemDescription(menuState.traditionalDessert)}</p>
              )}
              
              {menuState.dessertType === 'canapes' && menuState.dessertCanapes?.length > 0 && (
                <div>
                  {menuState.dessertCanapes.map((item, idx) => (
                    <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(item)}</p>
                  ))}
                </div>
              )}
              
              {menuState.dessertType === 'cakes' && menuState.individualCakes?.length > 0 && (
                <div>
                  {menuState.individualCakes.map((item, idx) => {
                    const quantity = menuState.individual_cake_quantities?.[item] || 0;
                    return (
                      <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(item)} x {quantity}</p>
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
                  const quantity = menuState.otherSelectionsQuantities?.[option] || 0;
                  return (
                    <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{getMenuItemDescription(option)} x {quantity}</p>
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

export default KitchenMenuContent;
