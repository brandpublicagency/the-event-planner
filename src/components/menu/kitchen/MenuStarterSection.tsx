
import React from 'react';
import { MenuState } from '@/hooks/menuStateTypes';
import { cleanItemDescription } from '@/utils/menu/formatHelpers';
import { getMenuItemDescription } from '@/utils/menu/menuItemDescriptions';

interface MenuStarterSectionProps {
  menuState: MenuState;
}

const MenuStarterSection: React.FC<MenuStarterSectionProps> = ({ menuState }) => {
  if (!menuState.selectedStarterType) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Arrival & Starter</h3>
      
      {menuState.selectedStarterType === 'harvest' && (
        <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>
          Harvest Table
        </p>
      )}
      
      {menuState.selectedStarterType === 'plated' && (
        <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>
          Plated Starter
        </p>
      )}
      
      {menuState.selectedStarterType === 'canapes' && (
        <>
          <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>
            Canapés{menuState.selectedCanapePackage ? ` - Choice of ${menuState.selectedCanapePackage}` : ''}
          </p>
          {menuState.selectedCanapes.length > 0 && (
            <div>
              {menuState.selectedCanapes.map((canape, idx) => (
                canape && <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(canape))}</p>
              ))}
            </div>
          )}
        </>
      )}
      
      {menuState.selectedStarterType === 'starter_canapes' && (
        <>
          <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>
            Canapés
          </p>
          {menuState.selectedCanapes.length > 0 && (
            <div>
              {menuState.selectedCanapes.map((canape, idx) => (
                canape && <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(canape))}</p>
              ))}
            </div>
          )}
        </>
      )}
      
      {menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter && (
        <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.selectedPlatedStarter))}</p>
      )}
      
      {menuState.selectedStarterType === 'harvest' && (
        <p style={{ fontSize: '12px', margin: '0' }}>Selection of breads, preserves, cheese and cold meats</p>
      )}
    </div>
  );
};

export default MenuStarterSection;
