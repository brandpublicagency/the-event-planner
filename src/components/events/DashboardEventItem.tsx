
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, Calendar, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { cn } from "@/lib/utils";

interface DashboardEventItemProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
}

export const DashboardEventItem: React.FC<DashboardEventItemProps> = ({ event, handleDelete }) => {
  const navigate = useNavigate();
  
  // Format time if available
  const getTimeDisplay = () => {
    if (!event.start_time) return null;
    
    let timeStr = format(new Date(`2000-01-01T${event.start_time}`), 'h:mm a');
    if (event.end_time) {
      timeStr += ` - ${format(new Date(`2000-01-01T${event.end_time}`), 'h:mm a')}`;
    }
    return timeStr;
  };

  const venueStr = getVenueNames(event);
  const timeStr = getTimeDisplay();

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
          
          <div className="flex flex-col gap-1 mt-1">
            {timeStr && (
              <div className="flex items-center text-xs text-zinc-500">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{timeStr}</span>
              </div>
            )}
            
            {event.pax && (
              <div className="flex items-center text-xs text-zinc-500">
                <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{event.pax} Guests</span>
              </div>
            )}
            
            {venueStr && (
              <div className="flex items-center text-xs text-zinc-500">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{venueStr}</span>
              </div>
            )}
          </div>
        </div>
      </button>
      
      <div className="flex items-center px-3 pb-3 pt-0 gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${event.event_code}/edit`);
          }}
          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        
        {handleDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this event? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(event.event_code)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
