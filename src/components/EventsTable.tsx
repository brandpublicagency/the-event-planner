import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
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
  groupedEvents: Record<string, any[]>;
  getStatusColor: (status: string) => string;
  handleDelete: (id: string) => Promise<void>;
}

const EventsTable = ({ groupedEvents, getStatusColor, handleDelete }: EventsTableProps) => {
  const navigate = useNavigate();

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-8">
        {Object.entries(groupedEvents).map(([monthYear, monthEvents]: [string, any]) => (
          <div key={monthYear} className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{monthYear}</h3>
              <Badge variant="secondary">
                {monthEvents.length} events
              </Badge>
            </div>
            
            <div className="rounded-md border">
              {monthEvents.map((event: any, index: number) => (
                <div key={event.id}>
                  <div className="flex items-center px-4 py-3 hover:bg-muted/50">
                    <div className="flex items-center flex-1 gap-4">
                      <div className="flex items-center gap-4">
                        <Checkbox />
                        <span className="font-medium">{format(parseISO(event.event_date), 'dd MMM yyyy')}</span>
                      </div>
                      <div className="flex flex-col space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium">{event.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {event.event_type} / {event.pax} Pax
                          </Badge>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {event.venue?.name && (
                            <span>{event.venue.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className="text-zinc-600 hover:text-zinc-900"
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-zinc-600 hover:text-zinc-900"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
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
                              onClick={() => handleDelete(event.id)}
                              className="bg-zinc-900 hover:bg-zinc-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {index !== monthEvents.length - 1 && <Separator />}
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