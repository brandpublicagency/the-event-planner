
import { Button } from "@/components/ui/button";
import { Trash, Copy, Pencil, Loader2, MapPin, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, isToday, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";
import { getVenueNames } from "@/utils/venueUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { AnimatedBorder } from "@/components/ui/animated-border";

interface EventCardProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
}

export const EventCard = ({
  event,
  handleDelete,
  isDashboard = false
}: EventCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const copyEventCode = (e: React.MouseEvent, eventCode: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(eventCode);
    toast({
      title: "Copied",
      description: "Event code copied to clipboard"
    });
  };
  
  const onDelete = async () => {
    if (!handleDelete) return;
    try {
      setIsDeleting(true);
      await handleDelete(event.event_code);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if event is happening today
  const eventIsToday = event.event_date ? isToday(new Date(event.event_date)) : false;

  // Get venue information
  const venueStr = getVenueNames(event);

  // Get formatted event date
  const eventDate = event.event_date ? parseISO(event.event_date) : null;
  const formattedDate = eventDate ? format(eventDate, 'EEE, d MMM') : 'No date';

  // Get event time
  const timeStr = event.start_time ? event.end_time ? `${event.start_time.substring(0, 5)} - ${event.end_time.substring(0, 5)}` : event.start_time.substring(0, 5) : null;

  // Get event type color
  const getEventTypeColor = () => {
    switch (event.event_type?.toLowerCase()) {
      case 'wedding':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'corporate':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'celebration':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  const eventCardContent = (
    <div className="bg-white p-5 transition-all duration-200 hover:bg-slate-50/20 py-[10px]">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-medium text-zinc-900 hover:text-gray-600 transition-colors">
                {event.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-zinc-500">{formattedDate}</span>
                {timeStr && <>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500">{timeStr}</span>
                  </>}
              </div>
            </div>
            
            {!isDashboard && <div className="flex items-center">
                <button onClick={e => copyEventCode(e, event.event_code)} className="text-[11px] px-2 py-0.5 border rounded text-zinc-500 bg-zinc-50 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-200 transition-colors flex items-center gap-1">
                  {event.event_code}
                  <Copy className="h-3 w-3" />
                </button>
              </div>}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {event.event_type && <span className={cn("text-xs px-2.5 py-1 rounded-full border", getEventTypeColor())}>
                {event.event_type}
              </span>}
            
            {venueStr && <div className="flex items-center text-xs text-zinc-600">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{venueStr}</span>
              </div>}
            
            {event.pax && <div className="flex items-center text-xs text-zinc-600">
                <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{event.pax} guests</span>
              </div>}
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-4">
          <Button variant="ghost" size="sm" onClick={e => {
          e.stopPropagation();
          navigate(`/events/${event.event_code}/edit`);
        }} className="text-zinc-500 hover:text-gray-600 hover:bg-gray-50 rounded-full h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
          
          {handleDelete && <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8 p-0" disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-red-100 bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">Permanently Delete Event</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-600">
                    <p className="mb-2">Are you sure you want to delete <span className="font-semibold">{event.name}</span>?</p>
                    <div className="bg-red-50 p-3 rounded-md border border-red-100 my-2">
                      <p className="text-red-800 text-sm">This action cannot be undone. The event and all associated data will be permanently deleted from the database.</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete()} className="bg-red-600 hover:bg-red-700 rounded-full text-white" disabled={isDeleting}>
                    {isDeleting ? <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </> : "Delete Permanently"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>}
        </div>
      </div>
    </div>
  );
  
  return (
    <div key={event.event_code} className="cursor-pointer" onClick={() => navigate(`/events/${event.event_code}`)}>
      {/* Only show animated border on the dashboard, not on the events page */}
      {isDashboard && eventIsToday ? (
        <AnimatedBorder borderWidth={3} borderRadius={0} className="mb-px">
          {eventCardContent}
        </AnimatedBorder>
      ) : (
        <div>
          {eventCardContent}
        </div>
      )}
    </div>
  );
};
