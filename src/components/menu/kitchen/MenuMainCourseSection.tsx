
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
      
      {/* Bold the main course type selection */}
      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>
        {menuState.mainCourseType === 'plated' ? 'Plated Menu' : 
         menuState.mainCourseType === 'karoo' ? 'Karoo Bush Table' :
         menuState.mainCourseType === 'buffet' ? 'Buffet Menu' : 
         cleanItemDescription(menuState.mainCourseType)}
      </p>
      
      {menuState.mainCourseType === 'plated' && menuState.platedMainSelection && (
        <>
          <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Main Selection:</p>
          <p style={{ fontSize: '12px', margin: '0', marginBottom: '8px' }}>{cleanItemDescription(getMenuItemDescription(menuState.platedMainSelection))}</p>
        </>
      )}
      
      {menuState.mainCourseType === 'plated' && menuState.platedSaladSelection && (
        <>
          <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
          <p style={{ fontSize: '12px', margin: '0' }}>{cleanItemDescription(getMenuItemDescription(menuState.platedSaladSelection))}</p>
        </>
      )}
      
      {/* Add other main course type specific content here */}
      {menuState.mainCourseType === 'karoo' && (
        <>
          {menuState.karooMeatSelection && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Main Selection:</p>
              <p style={{ fontSize: '12px', margin: '0', marginBottom: '8px' }}>{cleanItemDescription(getMenuItemDescription(menuState.karooMeatSelection))}</p>
            </>
          )}
          
          {menuState.karooStarchSelection && menuState.karooStarchSelection.length > 0 && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selection:</p>
              {menuState.karooStarchSelection.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </>
          )}
          
          {menuState.karooVegetableSelections && menuState.karooVegetableSelections.length > 0 && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selection:</p>
              {menuState.karooVegetableSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </>
          )}
          
          {menuState.karooSaladSelection && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
              <p style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(menuState.karooSaladSelection))}</p>
            </>
          )}
        </>
      )}
      
      {menuState.mainCourseType === 'buffet' && (
        <>
          {menuState.buffetMeatSelections && menuState.buffetMeatSelections.length > 0 && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Main Selection:</p>
              {menuState.buffetMeatSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </>
          )}
          
          {menuState.buffetVegetableSelections && menuState.buffetVegetableSelections.length > 0 && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Vegetable Selections:</p>
              {menuState.buffetVegetableSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </>
          )}
          
          {menuState.buffetStarchSelections && menuState.buffetStarchSelections.length > 0 && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Starch Selections:</p>
              {menuState.buffetStarchSelections.map((item, idx) => (
                <p key={idx} style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(item))}</p>
              ))}
            </>
          )}
          
          {menuState.buffetSaladSelection && (
            <>
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', marginBottom: '4px' }}>Salad Selection:</p>
              <p style={{ fontSize: '12px', margin: '0', marginBottom: '4px' }}>{cleanItemDescription(getMenuItemDescription(menuState.buffetSaladSelection))}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MenuMainCourseSection;
