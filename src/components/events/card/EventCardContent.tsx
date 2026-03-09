
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
    if (lowerType.includes('wedding')) return <Award className="h-3 w-3 mr-1 text-muted-foreground" />;
    if (lowerType.includes('corporate')) return <Briefcase className="h-3 w-3 mr-1 text-muted-foreground" />;
    if (lowerType.includes('birthday')) return <Star className="h-3 w-3 mr-1 text-muted-foreground" />;
    return <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />;
  };
  return <div className="space-y-0.5 flex-1">
      <div className="my-0 py-px flex items-end justify-start">
        <h4 className="text-foreground font-normal text-base">
          <Link to={`/events/${event_code}`} className="hover:text-primary cursor-pointer text-base font-normal">
            {name}
          </Link>
        </h4>
        <div className="ml-2 text-[10px] text-muted-foreground flex items-center gap-0.5 cursor-pointer hover:text-foreground" onClick={(e) => copyEventCode(event_code, e)}>
          <span className="text-[10px] mb-[3px]">{event_code}</span>
          <Copy className="h-2.5 w-2.5" />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
        <div className="flex items-center">
          <span className="font-medium text-xs text-foreground font-sans">{formattedDate}</span>
        </div>
        
        {event_type && <div className="flex items-center">
            {getEventTypeIcon(event_type)}
            <span className="text-xs text-muted-foreground">{event_type}</span>
          </div>}
        
        {pax && <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-xs">{pax} guests</span>
            
            {venueStr && venueStr !== 'No venues selected' && <>
                <span className="mx-1 text-border">•</span>
                <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{venueStr}</span>
              </>}
          </div>}
      </div>
    </div>;
};