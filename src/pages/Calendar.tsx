import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import AvailabilityList from "@/components/calendar/AvailabilityList";
import { supabase } from "@/integrations/supabase/client";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      return data;
    },
  });

  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: events } = useQuery({
    queryKey: ['events', date?.getMonth(), date?.getFullYear()],
    queryFn: async () => {
      const startOfMonth = new Date(date!.getFullYear(), date!.getMonth(), 1);
      const endOfMonth = new Date(date!.getFullYear(), date!.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_venues (
            venues (
              id,
              name
            )
          )
        `)
        .gte('event_date', startOfMonth.toISOString())
        .lte('event_date', endOfMonth.toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data?.map(event => ({
        ...event,
        venues: event.event_venues?.map((ev: any) => ev.venues) || []
      }));
    },
    enabled: !!date,
  });

  // Create a modifiers object for the calendar to highlight event dates
  const eventDates = events?.reduce((acc: { [key: string]: boolean }, event) => {
    if (event.event_date) {
      acc[new Date(event.event_date).toISOString()] = true;
    }
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'tentative':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  // Filter events for the selected date
  const selectedDateEvents = events?.filter(event => 
    event.event_date && new Date(event.event_date).toDateString() === date?.toDateString()
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <CalendarFilters
          venues={venues}
          selectedVenue={selectedVenue}
          setSelectedVenue={setSelectedVenue}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>
      
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6" />
          <h3 className="text-lg font-medium">
            {profile?.full_name || "Your"} Calendar
          </h3>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[300px,1fr]">
          <div>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{ hasEvent: eventDates }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: 'rgb(219 234 254)',
                  fontWeight: 'bold'
                }
              }}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">
              Events for {format(date || new Date(), "MMMM d, yyyy")}
            </h4>
            
            {selectedDateEvents && selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.event_code}
                    className="rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{event.name}</h5>
                        <p className="text-sm text-gray-500">
                          {event.event_type} - {event.pax} Pax
                        </p>
                        <p className="text-sm text-gray-500">
                          Venues: {event.venues.map((v: any) => v.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events scheduled for this date.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;