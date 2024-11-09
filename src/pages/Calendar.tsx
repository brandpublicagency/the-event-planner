import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date');
      
      if (error) throw error;
      return data;
    },
  });

  const selectedDateEvents = events?.filter(
    (event) => date && format(new Date(event.event_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const handleGoogleCalendarSync = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('calendar-auth');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No authorization URL returned');
      }
    } catch (error) {
      console.error('Calendar sync error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate calendar sync. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <Button onClick={handleGoogleCalendarSync} variant="outline" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          Sync with Google Calendar
        </Button>
      </div>
      
      <div className="grid gap-8">
        <Card className="p-6">
          <div className="flex justify-center">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none w-full max-w-3xl"
              disabled={(date) => date > new Date(2025, 12, 31) || date < new Date(2000, 0, 1)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Events for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
          </h3>
          <div className="space-y-4">
            {selectedDateEvents?.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{event.name}</h4>
                  <p className="text-sm text-zinc-500">
                    {format(new Date(event.event_date), 'h:mm a')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  event.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-zinc-100 text-zinc-800'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
            {(!selectedDateEvents || selectedDateEvents.length === 0) && (
              <p className="text-zinc-500">No events scheduled for this date.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;