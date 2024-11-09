import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
      
      <div className="grid gap-4 md:grid-cols-[300px,1fr]">
        <Card>
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Events for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
            </h3>
            <div className="space-y-4">
              {selectedDateEvents?.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.event_date), 'h:mm a')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    event.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
              {(!selectedDateEvents || selectedDateEvents.length === 0) && (
                <p className="text-muted-foreground">No events scheduled for this date.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;