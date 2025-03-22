
import React from 'react';
import { Event } from '@/types/event';
import { getEventHeaderInfo } from './menuItemUtils';

interface MenuEventHeaderProps {
  event: Event;
}

const MenuEventHeader: React.FC<MenuEventHeaderProps> = ({ event }) => {
  const eventInfo = getEventHeaderInfo(event);
  
  return (
    <div className="event-header" style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{eventInfo.name}</h2>
      <p style={{ fontSize: '12px', margin: '0' }}>
        {eventInfo.date}, {eventInfo.time} / {eventInfo.pax} Guests / {eventInfo.eventType} / {eventInfo.venueNames}
      </p>
      <div style={{ marginTop: '16px', borderTop: '1px solid #ddd' }}></div>
    </div>
  );
};

export default MenuEventHeader;
