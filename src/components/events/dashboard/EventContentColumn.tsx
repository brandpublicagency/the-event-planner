
import React from "react";
import type { Event } from "@/types/event";
import { format } from "date-fns";
import { MapPin, Users, Calendar, Copy } from "lucide-react";
import { useCopyEventCode } from "../utils/eventCodeUtils";
import { toast } from "@/hooks/use-toast";

interface EventContentColumnProps {
  event: Event;
  venueStr: string;
}

export const EventContentColumn: React.FC<EventContentColumnProps> = ({
  event,
  venueStr
}) => {
  const copyEventCode = useCopyEventCode();

  // Format the event date if it exists
  const eventDate = event.event_date ? format(new Date(event.event_date), "d MMMM yyyy") : null;
  
  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyEventCode(event.event_code, e);
    toast.success(`Event code ${event.event_code} copied to clipboard`);
  };
  
  return <div className="flex-1 py-3 px-5">
      <div className="flex items-center">
        <h3 className="text-base font-normal text-gray-800 mb-0.5 line-clamp-1">{event.name}</h3>
        <button onClick={handleCopyCode} className="ml-2 flex items-center gap-0.5 text-[10px] text-zinc-700 hover:text-zinc-900 transition-colors">
          <span className="text-[10px]">{event.event_code}</span>
          <Copy className="h-2.5 w-2.5" />
        </button>
      </div>
      <div className="flex items-center flex-wrap gap-x-3 text-xs text-gray-500">
        {event.event_type && <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-zinc-400" />
            {event.event_type}
          </span>}
        
        {event.pax && <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-zinc-400" />
            {event.pax} guests
          </span>}
        
        {venueStr && venueStr !== 'No venues selected' && <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-zinc-400" />
            {venueStr}
          </span>}
      </div>
    </div>;
};
