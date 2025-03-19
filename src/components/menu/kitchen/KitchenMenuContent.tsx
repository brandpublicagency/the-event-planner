
import React, { useEffect } from 'react';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { 
  formatDate, 
  formatTimeDisplay, 
  formatNotes, 
  getMenuItemDescription, 
  getEventHeaderInfo 
} from './menuItemUtils';
import { menuItemDescriptions } from './menuItemDescriptions';

// Define interface for the print props
interface KitchenMenuContentProps {
  event: Event;
  menuState: MenuState;
}

// Component that will be printed
const KitchenMenuContent = React.forwardRef<HTMLDivElement, KitchenMenuContentProps>(({ event, menuState }, ref) => {
  // For debugging
  useEffect(() => {
    console.log('Event object:', event);
    console.log('Event venues:', event.event_venues);
  }, [event]);

  const eventInfo = getEventHeaderInfo(event);

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
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{eventInfo.name}</h2>
        <p style={{ fontSize: '12px', margin: '0' }}>
          {eventInfo.date}, {eventInfo.time} / {eventInfo.pax} Guests / {eventInfo.eventType} / {eventInfo.venueNames}
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
          {renderStarterSection(menuState)}

          {/* Main Course Section */}
          {renderMainCourseSection(menuState)}

          {/* Dessert Section */}
          {renderDessertSection(menuState)}

          {/* Additional Options Section */}
          {renderAdditionalOptionsSection(menuState)}
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
