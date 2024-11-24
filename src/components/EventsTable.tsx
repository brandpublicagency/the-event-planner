import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Edit, Trash, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import type { Event } from "@/types/event";
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
  handleDelete: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
}

const EventsTable = ({ groupedEvents, handleDelete, isDashboard = false }: EventsTableProps) => {
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
    if (!event.event_venues || event.event_venues.length === 0) return 'No venues';
    return event.event_venues.map(ev => ev.venues?.name).filter(Boolean).join(' + ') || 'No venues';
  };

  return (
    <ScrollArea className={isDashboard ? "h-full" : "h-[calc(100vh-12rem)]"}>
      <div className="space-y-4">
        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
          <div key={monthYear} className={isDashboard ? "" : "rounded-xl border bg-white"}>
            {!isDashboard && (
              <div className="flex items-center gap-2 p-3 border-b">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">{monthYear}</h3>
                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                  {monthEvents.length} events
                </Badge>
              </div>
            )}
            
            <div className={isDashboard ? "space-y-2" : "divide-y"}>
              {monthEvents.map((event) => (
                <div 
                  key={event.event_code} 
                  className={isDashboard ? 
                    "group flex items-center px-4 py-3 hover:bg-zinc-50/50 transition-colors rounded-lg border bg-white" : 
                    "group"
                  }
                >
                  {isDashboard ? (
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => navigate(`/events/${event.event_code}`)}
                        className="text-sm font-medium truncate text-left hover:underline"
                      >
                        {event.name}
                      </button>
                      <div className="flex items-center gap-3">
                        {event.event_date && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(event.event_date), "dd MMM yyyy")}</span>
                          </div>
                        )}
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600">
                          {event.event_type}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-4">
                      <h4 className="text-sm font-medium truncate">{event.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(event.event_date), "dd MMM yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getVenueNames(event)}
                      </div>
                    </div>
                  )}
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