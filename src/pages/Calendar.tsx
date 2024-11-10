import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import { supabase } from "@/integrations/supabase/client";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { EventsList } from "@/components/calendar/EventsList";
import type { Event } from "@/types/event";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

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

      const formattedEvents: Event[] = data.map(event => ({
        ...event,
        venues: event.event_venues?.map((ev: any) => ev.venues) || [],
        title: event.name,
        progress: 0,
        teamSize: event.pax || 0,
        dueDate: event.event_date || '',
        status: 'Confirmed' as const,
        created_at: event.created_at,
        updated_at: event.updated_at,
        created_by: event.created_by,
        description: event.description,
        event_code: event.event_code,
        event_type: event.event_type,
        client_address: event.client_address,
        package_id: event.package_id,
        event_date: event.event_date,
      }));

      return formattedEvents;
    },
    enabled: !!date,
  });

  const modifiers = {
    hasEvent: events?.map(event => event.event_date ? new Date(event.event_date) : null).filter(Boolean) || [],
    selected: date,
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: 'rgb(250 250 250)',
      color: '#18181B',
      fontWeight: '500'
    },
    selected: {
      backgroundColor: '#18181B !important',
      color: 'white !important',
      fontWeight: '500'
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-900" />
      </div>
    );
  }

  // Filter events for the selected date
  const selectedDateEvents = events?.filter(event => 
    event.event_date && new Date(event.event_date).toDateString() === date?.toDateString()
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-primary-900">Calendar</h2>
        <CalendarFilters
          venues={venues}
          selectedVenue={selectedVenue}
          setSelectedVenue={setSelectedVenue}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>
      
      <CalendarHeader profileName={profile?.full_name} isLoading={isProfileLoading} />

      <div className="mt-6 grid gap-8 md:grid-cols-[400px,1fr]">
        <Card className="bg-white p-4 rounded-xl shadow-sm">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            showOutsideDays={false}
          />
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-primary-900 text-lg">
              Events for {format(date || new Date(), "MMMM d, yyyy")}
            </h4>
            {isEventsLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-primary-900" />
            )}
          </div>
          
          <EventsList 
            date={date} 
            events={selectedDateEvents} 
            isLoading={isEventsLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
