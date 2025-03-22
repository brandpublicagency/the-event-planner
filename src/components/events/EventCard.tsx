
import { Button } from "@/components/ui/button";
import { Trash, Copy, Pencil, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, isToday } from "date-fns";
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
  
  const eventCardContent = (
    <div className="px-[15px] py-[15px]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`/events/${event.event_code}`)} className="text-sm font-medium text-zinc-900 no-underline hover:no-underline">
              {event.name}
            </button>
            {!isDashboard && <button onClick={e => copyEventCode(e, event.event_code)} className="text-[11px] px-2 py-0.5 border rounded text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-1">
                {event.event_code}
                <Copy className="h-3 w-3" />
              </button>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-900">
              <span className="font-medium">
                {event.event_date ? format(new Date(event.event_date), 'dd MMMM') : 'No date'}
              </span>
              <span className="ml-2 text-zinc-500">
                {event.event_type} / <span className="text-zinc-900">{event.pax} Pax</span> / {getVenueNames(event)}
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={e => {
          e.stopPropagation();
          navigate(`/events/${event.event_code}/edit`);
        }} className="text-zinc-600 hover:text-white hover:bg-zinc-900">
            <Pencil className="h-4 w-4" />
          </Button>
          
          {handleDelete && <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-white hover:bg-red-600" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
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
                  <AlertDialogAction 
                    onClick={() => onDelete()} 
                    className="bg-red-600 hover:bg-red-700 rounded-full text-white"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : "Delete Permanently"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>}
        </div>
      </div>
    </div>
  );
  
  return (
    <div key={event.event_code}>
      {eventIsToday ? (
        <AnimatedBorder borderWidth={2} borderRadius={0} className="mb-2">
          {eventCardContent}
        </AnimatedBorder>
      ) : (
        eventCardContent
      )}
    </div>
  );
};
