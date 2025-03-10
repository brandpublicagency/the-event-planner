
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Copy, Check, CalendarPlus } from "lucide-react";
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

export const DashboardEventItem: React.FC<DashboardEventItemProps> = ({ event, handleDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const venueStr = getVenueNames(event);
  
  const copyEventCode = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the badge
    navigator.clipboard.writeText(event.event_code)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `Event code ${event.event_code} copied to clipboard`,
          duration: 3000,
        });
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy event code to clipboard",
          duration: 3000,
        });
      });
  };

  const syncToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    toast({
      title: "Coming Soon",
      description: "Event syncing with Google Calendar will be available soon!"
    });
  };
  
  return (
    <div className="w-full hover:bg-zinc-50 transition-colors rounded-md overflow-hidden">
      <button
        onClick={() => navigate(`/events/${event.event_code}`)}
        className="text-left flex-1 w-full p-3"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-sm font-medium",
              event.event_date && new Date(event.event_date).toDateString() === new Date().toDateString() 
                ? "text-blue-600" 
                : "text-zinc-900"
            )}>
              {event.event_date ? format(new Date(event.event_date), 'dd MMMM') : 'No date'} - {event.name}
              <Badge 
                variant="outline" 
                className="ml-2 text-xs font-normal text-[10px] cursor-pointer hover:bg-zinc-100"
                onClick={copyEventCode}
              >
                {event.event_code}
                <Copy className="ml-1 h-2.5 w-2.5 opacity-70" />
              </Badge>
            </span>
            
            <Button
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={syncToCalendar}
            >
              <CalendarPlus className="h-3.5 w-3.5 text-zinc-500" />
              <span className="sr-only">Sync to Calendar</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500">
            {venueStr && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{venueStr}</span>
              </div>
            )}
            
            {event.pax && (
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{event.pax} guests</span>
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
