import React from "react";
import { MapPin, Users, Copy } from "lucide-react";
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
  return <div className="flex-1 py-3 px-5">
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-zinc-900 text-xs">{event.name}</h4>
          
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 cursor-pointer hover:text-zinc-700" onClick={e => copyEventCode(event.event_code, e)}>
              <span className="text-gray-500">EVENT-{event.event_code}</span>
              <Copy className="h-2.5 w-2.5 opacity-70" />
            </div>
          </div>
        </div>
        
        {/* Location and guests info */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
          <div className="flex items-center">
            {venueStr && <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0 text-zinc-400" />
                <span className="truncate text-gray-700">{venueStr}</span>
              </div>}
          </div>
          
          {event.pax && <div className="flex items-center">
              <Users className="h-3 w-3 mr-1.5 flex-shrink-0 text-zinc-400" />
              <span className="text-gray-700">{event.pax} guests</span>
            </div>}
        </div>
      </div>
    </div>;
};