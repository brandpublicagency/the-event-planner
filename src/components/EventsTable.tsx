import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventStatus = "Inquiry" | "Tentative" | "Confirmed" | "Completed" | "Cancelled";

interface EventsTableProps {
  groupedEvents: Record<string, any[]>;
  handleDelete: (id: string) => Promise<void>;
}

const EventsTable = ({ groupedEvents, handleDelete }: EventsTableProps) => {
  const navigate = useNavigate();

  const handleStatusChange = async (eventId: string, newStatus: EventStatus) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          status: newStatus,
          package_id: null // Reset package_id to avoid foreign key constraint error
        })
        .eq('id', eventId);

      if (error) throw error;

      // Refresh the page to show the updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

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
                      <div className="flex flex-col space-y-2.5 flex-1">
                        <div className="flex items-center gap-4">
                          <Checkbox />
                          <span className="font-medium">{format(parseISO(event.event_date), 'dd MMM yyyy')}</span>
                          <Badge variant="outline">
                            {event.event_type} / {event.pax} Pax
                          </Badge>
                          <div className="w-[90px]">
                            <Select
                              value={event.status}
                              onValueChange={(value: EventStatus) => handleStatusChange(event.id, value)}
                            >
                              <SelectTrigger className="border-0 h-auto hover:bg-zinc-100 focus:ring-0 p-1">
                                <span className="text-zinc-900">{event.status}</span>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inquiry">Inquiry</SelectItem>
                                <SelectItem value="Tentative">Tentative</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium">{event.name}</span>
                          {event.venue?.name && (
                            <span className="text-sm text-muted-foreground">• {event.venue.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className="text-zinc-600 hover:text-zinc-100 hover:bg-zinc-800"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-zinc-600 hover:text-zinc-100 hover:bg-zinc-800"
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