
import React from 'react';
import { MenuState } from '@/hooks/menuStateTypes';
import { cleanItemDescription } from '@/utils/menu/formatHelpers';
import { getMenuItemDescription } from '@/utils/menu/menuItemDescriptions';

interface MenuMainCourseSectionProps {
  menuState: MenuState;
}

const MenuMainCourseSection: React.FC<MenuMainCourseSectionProps> = ({ menuState }) => {
  if (!menuState.mainCourseType) return null;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '8px' }}>Main Course</h3>
      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '8px' }}>{cleanItemDescription(getMenuItemDescription(menuState.mainCourseType))}</p>
      
      {/* Buffet details */}
      {menuState.mainCourseType === 'buffet' && (
        <div>
          {menuState.buffetMeatSelections.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Meat Selections:</p>
              {menuState.buffetMeatSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </div>
          )}
          
          {menuState.buffetVegetableSelections.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
              {menuState.buffetVegetableSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </div>
          )}
          
          {menuState.buffetStarchSelections.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
              {menuState.buffetStarchSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </div>
          )}
          
          {menuState.buffetSaladSelection && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Table Salad:</p>
              <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.buffetSaladSelection))}</p>
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
              <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.karooMeatSelection))}</p>
            </div>
          )}
          
          {menuState.karooStarchSelection?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
              {menuState.karooStarchSelection.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </div>
          )}
          
          {menuState.karooVegetableSelections?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
              {menuState.karooVegetableSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </div>
          )}
          
          {menuState.karooSaladSelection && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Table Salad:</p>
              <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.karooSaladSelection))}</p>
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
              <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.platedMainSelection))}</p>
            </div>
          )}
          
          {menuState.platedSaladSelection && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Table Salad:</p>
              <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.platedSaladSelection))}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuMainCourseSection;
