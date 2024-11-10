import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Calendar as CalendarIcon, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
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
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{monthYear}</h3>
              <Badge variant="secondary" className="ml-2">
                {monthEvents.length} events
              </Badge>
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,0.5fr] px-4 py-3 text-sm font-medium text-muted-foreground">
                <div>Event Details</div>
                <div>Date</div>
                <div>Venue</div>
                <div>Type</div>
                <div>Guests</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <Separator />
              {monthEvents.map((event: any, index: number) => (
                <div
                  key={event.id}
                  className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,0.5fr] items-center px-4 py-3 hover:bg-muted/50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{event.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {event.bride_name && event.groom_name 
                        ? `${event.bride_name} & ${event.groom_name}`
                        : event.client_address}
                    </span>
                  </div>
                  <div>{format(parseISO(event.event_date), 'dd MMM yyyy')}</div>
                  <div>{event.venue?.name || 'TBC'}</div>
                  <div>
                    <Badge variant="outline">
                      {event.event_type}
                    </Badge>
                  </div>
                  <div>{event.pax || 'TBC'}</div>
                  <div>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/events/${event.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
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
                            onClick={() => handleDelete(event.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {index !== monthEvents.length - 1 && <Separator className="col-span-7 my-0" />}
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