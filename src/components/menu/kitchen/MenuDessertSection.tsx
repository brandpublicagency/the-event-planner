
import React from 'react';
import { MenuState } from '@/hooks/menuStateTypes';
import { cleanItemDescription } from './menuItemUtils';
import { getMenuItemDescription } from './menuItemDescriptions';

interface MenuDessertSectionProps {
  menuState: MenuState;
}

const MenuDessertSection: React.FC<MenuDessertSectionProps> = ({ menuState }) => {
  if (!menuState.dessertType) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Dessert</h3>
      <p style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(menuState.dessertType))}</p>
      
      {menuState.dessertType === 'traditional' && menuState.traditionalDessert && (
        <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.traditionalDessert))}</p>
      )}
      
      {menuState.dessertType === 'canapes' && menuState.dessertCanapes?.length > 0 && (
        <div>
          {menuState.dessertCanapes.map((item, idx) => (
            <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
          ))}
        </div>
      )}
      
      {menuState.dessertType === 'cakes' && menuState.individualCakes?.length > 0 && (
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
