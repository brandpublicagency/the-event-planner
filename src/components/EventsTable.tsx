import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
  handleDelete: (eventCode: string) => Promise<void>;
}

const EventsTable = ({ groupedEvents }: EventsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (eventCode: string) => {
    try {
      // Delete from events table (cascade will handle related tables)
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('event_code', eventCode);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      // Refresh the page to show updated list
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
          <div key={monthYear} className="rounded-lg border bg-white shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b bg-white">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{monthYear}</h3>
              <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                {monthEvents.length} events
              </Badge>
            </div>
            
            <div className="divide-y">
              {monthEvents.map((event: any) => (
                <div key={event.event_code} className="group">
                  <div className="flex items-center px-4 py-3 hover:bg-white transition-colors">
                    <div className="flex items-center flex-1">
                      <div className="flex flex-col gap-2.5 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                              {event.event_code}
                            </span>
                            <span className="font-medium whitespace-nowrap">
                              {event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'No date'}
                            </span>
                          </div>
                        </div>
                        <div className="pl-[30px] space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-medium leading-none">{event.name}</h4>
                            <Badge variant="outline" className="text-xs font-normal bg-zinc-50">
                              {event.event_type} / {event.pax} Pax / {event.venues?.map((v: any) => v.name).join(' + ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/events/${event.event_code}/edit`)}
                        className="text-zinc-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-zinc-600"
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