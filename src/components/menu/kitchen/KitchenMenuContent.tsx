
import React from 'react';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import MenuEventHeader from './MenuEventHeader';
import MenuCustomSection from './MenuCustomSection';
import MenuStarterSection from './MenuStarterSection';
import MenuMainCourseSection from './MenuMainCourseSection';
import MenuDessertSection from './MenuDessertSection';
import MenuAdditionalOptionsSection from './MenuAdditionalOptionsSection';
import MenuNotesSection from './MenuNotesSection';

// Define interface for the print props
interface KitchenMenuContentProps {
  event: Event;
  menuState: MenuState;
}

// Component that will be printed
const KitchenMenuContent = React.forwardRef<HTMLDivElement, KitchenMenuContentProps>(({ event, menuState }, ref) => {
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

      <MenuEventHeader event={event} />

      {/* Custom Menu Section */}
      {menuState.isCustomMenu && <MenuCustomSection menuState={menuState} />}

      {/* Standard Menu */}
      {!menuState.isCustomMenu && (
        <>
          <MenuStarterSection menuState={menuState} />
          <MenuMainCourseSection menuState={menuState} />
          <MenuDessertSection menuState={menuState} />
          <MenuAdditionalOptionsSection menuState={menuState} />
        </>
      )}

      {/* Divider */}
      <hr style={{ margin: '16px 0', borderColor: '#ddd' }} />

      {/* Notes Section */}
      {menuState.notes && <MenuNotesSection notes={menuState.notes} />}
    </div>
  );
});

KitchenMenuContent.displayName = 'KitchenMenuContent';

export default KitchenMenuContent;
