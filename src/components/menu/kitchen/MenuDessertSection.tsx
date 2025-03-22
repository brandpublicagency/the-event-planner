
import React from 'react';
import { MenuState } from '@/hooks/menuStateTypes';
import { cleanItemDescription } from '@/utils/menu/formatHelpers';
import { getMenuItemDescription } from '@/utils/menu/menuItemDescriptions';

interface MenuDessertSectionProps {
  menuState: MenuState;
}

const MenuDessertSection: React.FC<MenuDessertSectionProps> = ({ menuState }) => {
  if (!menuState.dessertType) return null;
  
  // Debug log to help troubleshoot
  console.log("Rendering dessert section with:", {
    type: menuState.dessertType,
    traditionalDessert: menuState.traditionalDessert,
    dessertCanapes: menuState.dessertCanapes,
    individualCakes: menuState.individualCakes
  });
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Dessert</h3>
      <p style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(menuState.dessertType))}</p>
      
      {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
        <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.traditionalDessert))}</p>
      )}
      
      {(menuState.dessertType === 'canapes' || menuState.dessertType === 'bar') && menuState.dessertCanapes?.length > 0 && (
        <div>
          {menuState.dessertCanapes.map((item, idx) => (
            <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
          ))}
        </div>
      )}
      
      {(menuState.dessertType === 'cakes' || menuState.dessertType === 'individual') && menuState.individualCakes?.length > 0 && (
        <div>
          {menuState.individualCakes.map((item, idx) => {
            const quantity = menuState.individual_cake_quantities?.[item] || 0;
            return (
              <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))} x {quantity}</p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuDessertSection;
