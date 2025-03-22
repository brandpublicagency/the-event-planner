
import React from 'react';
import { MenuState } from '@/hooks/menuStateTypes';

interface MenuCustomSectionProps {
  menuState: MenuState;
}

const MenuCustomSection: React.FC<MenuCustomSectionProps> = ({ menuState }) => {
  if (!menuState.isCustomMenu) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Custom Menu</h3>
      <p style={{ fontSize: '12px', whiteSpace: 'pre-line', margin: '0' }}>{menuState.customMenuDetails}</p>
    </div>
  );
};

export default MenuCustomSection;
