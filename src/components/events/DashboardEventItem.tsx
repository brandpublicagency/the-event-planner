
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { cn } from "@/lib/utils";

interface DashboardEventItemProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
}

export const DashboardEventItem: React.FC<DashboardEventItemProps> = ({ event, handleDelete }) => {
  const navigate = useNavigate();
  const venueStr = getVenueNames(event);
  
  return (
    <div className="w-full hover:bg-zinc-50 transition-colors rounded-md overflow-hidden">
      <button
        onClick={() => navigate(`/events/${event.event_code}`)}
        className="text-left flex-1 w-full p-3"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <span className={cn(
              "text-sm font-medium",
              event.event_date && new Date(event.event_date).toDateString() === new Date().toDateString() 
                ? "text-blue-600" 
                : "text-zinc-900"
            )}>
              {event.event_date ? format(new Date(event.event_date), 'dd MMMM') : 'No date'} - {event.name}
            </span>
          </div>
          
          {venueStr && (
            <div className="flex items-center text-xs text-zinc-500">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{venueStr}</span>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
