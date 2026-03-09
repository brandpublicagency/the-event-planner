
import React from "react";
import { format, isToday } from "date-fns";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { EventDateColumn } from "./dashboard/EventDateColumn";
import { EventContentColumn } from "./dashboard/EventContentColumn";
import { EventActionsColumn } from "./dashboard/EventActionsColumn";
import { EventCardWrapper } from "./dashboard/EventCardWrapper";

interface DashboardEventItemProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
}

export const DashboardEventItem: React.FC<DashboardEventItemProps> = ({
  event,
  handleDelete,
  isDashboard = true
}) => {
  const venueStr = getVenueNames(event);
  
  const eventDate = event.event_date ? new Date(event.event_date) : null;
  const formattedStartTime = event.start_time ? event.start_time.substring(0, 5) : "";

  // Extract day from date
  const day = eventDate ? format(eventDate, "d") : "";
  
  // Check if event is happening today
  const eventIsToday = eventDate ? isToday(eventDate) : false;
  
  const eventCardContent = (
    <div className="flex items-stretch w-full bg-card">
      {/* Date column */}
      <EventDateColumn day={day} startTime={formattedStartTime} />
      
      {/* Content column */}
      <EventContentColumn event={event} venueStr={venueStr} />
      
      {/* Actions column - only show if NOT on dashboard */}
      {!isDashboard && handleDelete && (
        <EventActionsColumn 
          eventCode={event.event_code} 
          eventName={event.name} 
          handleDelete={handleDelete} 
        />
      )}
    </div>
  );
  
  return (
    <EventCardWrapper 
      eventCode={event.event_code}
      eventIsToday={eventIsToday}
    >
      {eventCardContent}
    </EventCardWrapper>
  );
};
