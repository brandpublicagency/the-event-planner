
import { Button } from "@/components/ui/button";
import { Calendar, Trash, Copy, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";
import { getVenueNames } from "@/utils/venueUtils";
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

interface EventCardProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
}

export const EventCard = ({
  event,
  handleDelete,
  isDashboard = false,
}: EventCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isPassedEventsPage = location.pathname === "/passed-events";

  const copyEventCode = (e: React.MouseEvent, eventCode: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(eventCode);
    toast({
      title: "Copied",
      description: "Event code copied to clipboard",
    });
  };

  return (
    <div key={event.event_code} className={cn(
      "group",
      isDashboard && "border rounded-lg"
    )}>
      <div className={cn(
        "flex flex-col gap-2 p-4",
        isDashboard && "p-3"
      )}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/events/${event.event_code}`)}
                className="text-sm font-medium text-zinc-900 no-underline hover:no-underline"
              >
                {event.name}
              </button>
              {!isPassedEventsPage && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.event_code}/edit`);
                    }}
                    className="p-0.5 text-zinc-400 hover:text-zinc-700"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  {handleDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-0.5 text-zinc-400 hover:text-zinc-700"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
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
              )}
              {!isDashboard && !isPassedEventsPage && (
                <button
                  onClick={(e) => copyEventCode(e, event.event_code)}
                  className="text-[11px] px-2 py-0.5 border rounded text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-1"
                >
                  {event.event_code}
                  <Copy className="h-3 w-3" />
                </button>
              )}
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
          {!isDashboard && handleDelete && !isPassedEventsPage && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/events/${event.event_code}/edit`)}
                className="text-zinc-600 hover:text-white hover:bg-zinc-900"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-600 hover:text-white hover:bg-zinc-900"
                  >
                    <Trash className="h-4 w-4" />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
