import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Edit, Trash, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";
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

interface EventsTableProps {
  groupedEvents: Record<string, Event[]>;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
  className?: string;
}

export const EventsTable = ({ 
  groupedEvents, 
  handleDelete, 
  isDashboard = false,
  className 
}: EventsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyEventCode = (eventCode: string) => {
    navigator.clipboard.writeText(eventCode);
    toast({
      title: "Copied",
      description: "Event code copied to clipboard",
    });
  };

  const getVenueNames = (event: Event) => {
    if (!event.venues || event.venues.length === 0) {
      if (!event.event_venues || event.event_venues.length === 0) return 'No venues';
      return event.event_venues.map(ev => ev.venues?.name).filter(Boolean).join(' + ') || 'No venues';
    }
    return event.venues.map(v => v.name).join(' + ');
  };

  return (
    <ScrollArea className={cn(
      isDashboard ? "h-[400px]" : "h-[calc(100vh-12rem)]",
      className
    )}>
      <div className="space-y-4">
        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
          <div key={monthYear} className="rounded-xl border bg-white">
            <div className={cn(
              "flex items-center gap-2 p-3 border-b",
              isDashboard && "p-2"
            )}>
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{monthYear}</h3>
              <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                {monthEvents.length} events
              </Badge>
            </div>
            
            <div className={cn(
              "divide-y",
              isDashboard && "grid grid-cols-1 gap-2 p-2 divide-y-0"
            )}>
              {monthEvents.map((event) => (
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
                          {!isDashboard && (
                            <button
                              onClick={() => copyEventCode(event.event_code)}
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
                            {!isDashboard && (
                              <span className="ml-2 text-zinc-500">
                                {event.event_type} / <span className="text-zinc-900">{event.pax} Pax</span> / {getVenueNames(event)}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      {!isDashboard && handleDelete && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/events/${event.event_code}/edit`)}
                            className="text-zinc-600 hover:text-white hover:bg-zinc-900"
                          >
                            <Edit className="h-4 w-4" />
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default EventsTable;