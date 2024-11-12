import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Edit, Trash, Copy } from "lucide-react";
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
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('event_code', eventCode);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const copyEventCode = (eventCode: string) => {
    navigator.clipboard.writeText(eventCode);
    toast({
      title: "Copied",
      description: "Event code copied to clipboard",
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
          <div key={monthYear} className="rounded-xl border border-zinc-200 bg-white">
            <div className="flex items-center gap-2 p-4 border-b border-zinc-100">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{monthYear}</h3>
              <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                {monthEvents.length} events
              </Badge>
            </div>
            
            <div className="divide-y divide-zinc-100">
              {monthEvents.map((event: any) => (
                <div key={event.event_code} className="group">
                  <div className="flex items-center px-4 py-3 hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center flex-1">
                      <div className="flex flex-col gap-2.5 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Checkbox />
                            <button
                              onClick={() => navigate(`/events/${event.event_code}`)}
                              className="text-xs px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-600 hover:bg-zinc-100 transition-colors"
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
                            <span className="font-medium whitespace-nowrap">
                              {event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'No date'}
                            </span>
                          </div>
                        </div>
                        <div className="pl-[30px] space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-medium leading-none">{event.name}</h4>
                            <Badge variant="outline" className="text-xs font-normal border border-zinc-200 bg-zinc-50 rounded-md">
                              {event.event_type} / {event.pax} Pax / {event.venues?.map((v: any) => v.name).join(' + ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/events/${event.event_code}/edit`)}
                        className="text-zinc-600 hover:text-zinc-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-zinc-600 hover:text-zinc-900"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border border-zinc-200">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this event? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border border-zinc-200">Cancel</AlertDialogCancel>
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