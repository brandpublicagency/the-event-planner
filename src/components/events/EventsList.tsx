
import React from "react";
import { useNavigate } from "react-router-dom";
import { EventMonthGroup } from "@/components/events/EventMonthGroup";
import type { Event } from "@/types/event";

interface EventsListProps {
  groupedEvents: Record<string, Event[]>;
  onDelete: (event: Event) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ groupedEvents, onDelete }) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full mt-[25px] px-[5px]">
      <div className="space-y-8">
        {Object.entries(groupedEvents).map(([month, monthEvents]) => (
          <EventMonthGroup 
            key={month} 
            monthYear={month} 
            events={monthEvents} 
            onEdit={eventCode => navigate(`/events/${eventCode}/edit`)} 
            onView={eventCode => navigate(`/events/${eventCode}`)} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};
