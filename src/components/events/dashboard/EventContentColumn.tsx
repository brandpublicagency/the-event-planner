
import React from "react";
import { MapPin, Users, Copy, Calendar, Briefcase, Star, Award } from "lucide-react";
import type { Event } from "@/types/event";
import { useCopyEventCode } from "../utils/eventCodeUtils";

interface EventContentColumnProps {
  event: Event;
  venueStr: string | null;
}

export const EventContentColumn: React.FC<EventContentColumnProps> = ({
  event,
  venueStr
}) => {
  const copyEventCode = useCopyEventCode();
  
  // Get appropriate icon based on event type
  const getEventTypeIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    
    if (lowerType.includes('wedding')) return <Award className="h-3 w-3 mr-1 text-zinc-400" />;
    if (lowerType.includes('corporate')) return <Briefcase className="h-3 w-3 mr-1 text-zinc-400" />;
    if (lowerType.includes('birthday')) return <Star className="h-3 w-3 mr-1 text-zinc-400" />;
    // Default icon for other event types
    return <Calendar className="h-3 w-3 mr-1 text-zinc-400" />;
  };
  
  return <div className="flex-1 py-3 px-5">
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm text-gray-800 font-normal">{event.name}</h4>
          
          <div className="flex items-center gap-2 text-base">
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 cursor-pointer hover:text-zinc-700" onClick={e => copyEventCode(event.event_code, e)}>
              <span className="text-gray-500">EVENT-{event.event_code}</span>
              <Copy className="h-2.5 w-2.5 opacity-70" />
            </div>
          </div>
        </div>
        
        {/* Event type and guest count */}
        <div className="flex items-center gap-3 text-[10px] text-zinc-500 mb-1">
          {event.event_type && (
            <div className="flex items-center">
              {getEventTypeIcon(event.event_type)}
              <span className="text-xs text-gray-500">{event.event_type}</span>
            </div>
          )}
          
          {event.pax && (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1 text-zinc-400" />
              <span className="text-xs text-gray-500">{event.pax} guests</span>
            </div>
          )}
          
          {/* Venue info */}
          {venueStr && venueStr !== 'No venues selected' && (
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-zinc-400" /> 
              <span className="text-xs text-gray-500">{venueStr}</span>
            </div>
          )}
        </div>
      </div>
    </div>;
};
