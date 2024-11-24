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
          <div key={monthYear} className="rounded-xl border bg-white">
            <div className="flex items-center gap-2 p-3 border-b">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{monthYear}</h3>
              <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                {monthEvents.length}
              </Badge>
            </div>
            
            <div className="divide-y">
              {monthEvents.map((event) => (
                <div key={event.event_code} className="group">
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="flex flex-col gap-1.5">
                        {!isDashboard && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/events/${event.event_code}`)}
                              className="text-[11px] px-2 py-0.5 border rounded text-zinc-600 hover:bg-zinc-50 transition-colors"
                            >
                              {event.event_code}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyEventCode(event.event_code);
                                }}
                                className="ml-1 inline-flex items-center hover:text-zinc-900"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </button>
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium truncate">{event.name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {event.event_date ? format(new Date(event.event_date), 'dd MMM yyyy') : 'No date'}
                            </span>
                          </div>
                          {!isDashboard && (
                            <Badge variant="outline" className="text-xs font-normal border bg-zinc-50">
                              {event.event_type} / {event.pax} Pax / {getVenueNames(event)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
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