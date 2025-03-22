
import React from 'react';
import { MenuState } from '@/hooks/menuStateTypes';
import { cleanItemDescription } from './menuItemUtils';
import { getMenuItemDescription } from './menuItemDescriptions';

interface MenuAdditionalOptionsSectionProps {
  menuState: MenuState;
}

const MenuAdditionalOptionsSection: React.FC<MenuAdditionalOptionsSectionProps> = ({ menuState }) => {
  if (!menuState.otherSelections || menuState.otherSelections.length === 0) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Additional Options</h3>
      <div>
        {menuState.otherSelections.map((option, idx) => {
          const quantity = menuState.otherSelectionsQuantities?.[option] || 0;
          return (
            <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>
              {cleanItemDescription(getMenuItemDescription(option))} x {quantity}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default MenuAdditionalOptionsSection;
