import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import AvailabilityList from "@/components/calendar/AvailabilityList";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const { toast } = useToast();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
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

  const { data: events, isLoading: isEventsLoading } = useQuery({
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
  const modifiers = {
    hasEvent: events?.map(event => event.event_date ? new Date(event.event_date) : null).filter(Boolean) || [],
    selected: date,
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: 'rgb(254 242 242)',
      color: '#FF5733',
      fontWeight: '600'
    },
    selected: {
      backgroundColor: '#FF5733 !important',
      color: 'white !important',
      fontWeight: '600'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5733]" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
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
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-[#FF5733]" />
          </div>
          <h3 className="text-lg font-medium">
            {profile?.full_name || "Your"} Calendar
          </h3>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-[400px,1fr]">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              showOutsideDays={false}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-[#FF5733] text-lg">
                Events for {format(date || new Date(), "MMMM d, yyyy")}
              </h4>
              {isEventsLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-[#FF5733]" />
              )}
            </div>
            
            {isEventsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : selectedDateEvents && selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.event_code}
                    className="rounded-lg border p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-lg">{event.name}</h5>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.event_type} - {event.pax} Pax
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Venues: {event.venues.map((v: any) => v.name).join(', ')}
                        </p>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No events scheduled for this date.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;