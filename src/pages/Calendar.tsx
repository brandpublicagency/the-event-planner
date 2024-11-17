import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import { supabase } from "@/integrations/supabase/client";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { EventsList } from "@/components/calendar/EventsList";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>();
  const { toast } = useToast();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [], isLoading: isEventsLoading, error: eventsError } = useQuery({
    queryKey: ['events', date?.getMonth(), date?.getFullYear(), selectedVenue],
    queryFn: async () => {
      if (!date) return [];

      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      let query = supabase
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
        .order('event_date');

      if (selectedVenue && selectedVenue !== 'all') {
        query = query.eq('event_venues.venue_id', selectedVenue);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error loading events",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data?.map(event => ({
        ...event,
        venues: event.event_venues?.map((ev: any) => ev.venues) || [],
      })) || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (eventsError) {
    toast({
      title: "Error loading events",
      description: "Please try again later",
      variant: "destructive",
    });
  }

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  // Filter events for the selected date
  const selectedDateEvents = events?.filter(event => 
    event.event_date && new Date(event.event_date).toDateString() === date?.toDateString()
  );

  const eventDates = events
    .map(event => event.event_date ? new Date(event.event_date) : null)
    .filter(Boolean) as Date[];

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-zinc-900">Calendar</h2>
        <CalendarFilters
          venues={venues}
          selectedVenue={selectedVenue}
          setSelectedVenue={setSelectedVenue}
        />
      </div>
      
      <CalendarHeader profileName={profile?.full_name} isLoading={isProfileLoading} />

      <div className="grid gap-6 lg:grid-cols-[420px,1fr] transition-all">
        <Card className="p-6 bg-white border border-zinc-200">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className={cn(
              "rounded-md border-none select-none",
              isEventsLoading && "opacity-50 pointer-events-none"
            )}
            modifiers={{ hasEvent: eventDates }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: '#f4f4f5',
                color: '#18181b',
                fontWeight: '500'
              }
            }}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </Card>

        <Card className="p-6 bg-white border border-zinc-200">
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              {isEventsLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              )}
            </div>
            
            <EventsList 
              date={date} 
              events={selectedDateEvents} 
              isLoading={isEventsLoading} 
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;