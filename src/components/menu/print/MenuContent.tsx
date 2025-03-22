
import React from 'react';
import { format } from 'date-fns';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import { getVenueNames } from '@/utils/venueUtils';
import { formatMenuDetails } from '@/utils/menu/formatMenuDetails';
import { formatMenuText } from './formatMenuText';

// Define interface for the print props
interface MenuContentProps {
  event: Event;
  menuState: MenuState;
}

// Component that will be printed
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(({ event, menuState }, ref) => {
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    // Format: "29 March 2025"
    return format(new Date(dateString), 'dd MMMM yyyy');
  };

  // Get event type
  const getEventType = (event: Event) => {
    return event.event_type || 'Event';
  };

  // Format menu details using the utility function
  const formattedMenu = formatMenuDetails(menuState);

  return (
    <div ref={ref} className="print-container p-8 max-w-[210mm] mx-auto">
      {/* Print header - LEFT ALIGNED as requested */}
      <div className="print-header">
        <h2>{event.name || 'Event'}</h2>
        <p>
          {formatDate(event.event_date)} / {event.pax} Guests / {getEventType(event)} / {getVenueNames(event)}
        </p>
      </div>

      <div className="menu-content">
        {/* Display formatted menu content */}
        <div className="whitespace-pre-line">
          {formatMenuText(formattedMenu)}
        </div>
      </div>
    </div>
  );
});

MenuContent.displayName = 'MenuContent';

export default MenuContent;
