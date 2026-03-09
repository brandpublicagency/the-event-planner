
import React from "react";
import { format, parseISO } from "date-fns";
import { MapPin, Users, Copy, Calendar, Briefcase, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";
import type { Event } from "@/types/event";
import { useCopyEventCode } from "../utils/eventCodeUtils";
interface EventCardContentProps {
  event: Event;
  venueStr: string;
}
export const EventCardContent: React.FC<EventCardContentProps> = ({
  event,
  venueStr
}) => {
  const {
    name,
    event_type,
    event_date,
    pax,
    event_code
  } = event;
  const copyEventCode = useCopyEventCode();
  const formattedDate = event_date ? format(parseISO(event_date), 'EEE, MMM d, yyyy') : 'No date set';

  // Get appropriate icon based on event type
  const getEventTypeIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('wedding')) return <Award className="h-3 w-3 mr-1 text-zinc-400" />;
    if (lowerType.includes('corporate')) return <Briefcase className="h-3 w-3 mr-1 text-zinc-400" />;
    if (lowerType.includes('birthday')) return <Star className="h-3 w-3 mr-1 text-zinc-400" />;
    // Default icon for other event types
    return <Calendar className="h-3 w-3 mr-1 text-zinc-400" />;
  };
  return <div className="space-y-0.5 flex-1">
      <div className="flex items-center my-0 py-px">
        <h4 className="text-foreground font-normal text-base">
          <Link to={`/events/${event_code}`} className="hover:text-primary cursor-pointer">
            {name}
          </Link>
        </h4>
        <div className="ml-2 text-[10px] text-zinc-700 flex items-center gap-0.5 cursor-pointer hover:text-zinc-900" onClick={e => copyEventCode(event_code, e)}>
          <span className="text-[10px]">{event_code}</span>
          <Copy className="h-2.5 w-2.5" />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500 mt-1">
        <div className="flex items-center">
          <span className="font-medium text-xs text-zinc-800">{formattedDate}</span>
        </div>
        
        {event_type && <div className="flex items-center">
            {getEventTypeIcon(event_type)}
            <span className="text-xs text-gray-500">{event_type}</span>
          </div>}
        
        {pax && <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-zinc-400" />
            <span className="text-xs">{pax} guests</span>
            
            {venueStr && venueStr !== 'No venues selected' && <>
                <span className="mx-1 text-zinc-300">•</span>
                <MapPin className="h-3 w-3 mr-1 text-zinc-400" />
                <span className="text-xs text-gray-500">{venueStr}</span>
              </>}
          </div>}
      </div>
    </div>;
};
