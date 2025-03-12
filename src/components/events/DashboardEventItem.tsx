import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Copy, Pencil, Trash } from "lucide-react";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
interface DashboardEventItemProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
}
export const DashboardEventItem: React.FC<DashboardEventItemProps> = ({
  event,
  handleDelete
}) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const venueStr = getVenueNames(event);
  const copyEventCode = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the badge
    navigator.clipboard.writeText(event.event_code).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `Event code ${event.event_code} copied to clipboard`,
        duration: 3000
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy event code to clipboard",
        duration: 3000
      });
    });
  };
  return <div className="w-full transition-colors overflow-hidden rounded-none bg-white">
      <button onClick={() => navigate(`/events/${event.event_code}`)} className="text-left flex-1 w-full p-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className={cn("text-sm font-medium", event.event_date && new Date(event.event_date).toDateString() === new Date().toDateString() ? "text-blue-600" : "text-zinc-900")}>
              {event.event_date ? format(new Date(event.event_date), 'dd MMMM') : 'No date'} - {event.name}
              <Badge variant="outline" className="ml-2 text-xs font-normal text-[10px] cursor-pointer hover:bg-zinc-100" onClick={copyEventCode}>
                {event.event_code}
                <Copy className="ml-1 h-2.5 w-2.5 opacity-70" />
              </Badge>
            </span>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={e => {
              e.stopPropagation();
              navigate(`/events/${event.event_code}/edit`);
            }} className="text-zinc-600 hover:text-white hover:bg-zinc-900">
                <Pencil className="h-4 w-4" />
              </Button>
              
              {handleDelete && <Button variant="ghost" size="sm" onClick={e => {
              e.stopPropagation();
              handleDelete(event.event_code);
            }} className="text-zinc-600 hover:text-white hover:bg-zinc-900">
                  <Trash className="h-4 w-4" />
                </Button>}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500">
            {venueStr && <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{venueStr}</span>
              </div>}
            
            {event.pax && <div className="flex items-center">
                <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{event.pax} guests</span>
              </div>}
          </div>
        </div>
      </button>
    </div>;
};