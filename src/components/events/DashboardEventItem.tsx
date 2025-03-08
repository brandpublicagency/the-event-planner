
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Event } from "@/types/event";

interface DashboardEventItemProps {
  event: Event;
}

export const DashboardEventItem: React.FC<DashboardEventItemProps> = ({ event }) => {
  const navigate = useNavigate();

  return (
    <button
      key={event.event_code}
      onClick={() => navigate(`/events/${event.event_code}`)}
      className="w-full text-left p-3 hover:bg-zinc-50"
    >
      <span className="text-xs">
        {event.event_date ? format(new Date(event.event_date), 'dd MMMM') : 'No date'}
        {' - '}
        <span className="text-zinc-900">{event.name}</span>
      </span>
    </button>
  );
};
