import { useQuery } from "@tanstack/react-query";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

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

  const selectedDateEvents = events?.filter(event => 
    event.event_date && new Date(event.event_date).toDateString() === date?.toDateString()
  );

  const eventDates = events
    .map(event => event.event_date ? new Date(event.event_date) : null)
    .filter(Boolean) as Date[];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-zinc-900" />
            <h2 className="text-2xl font-semibold text-zinc-900">Calendar</h2>
          </div>
          <CalendarFilters
            venues={venues}
            selectedVenue={selectedVenue}
            setSelectedVenue={setSelectedVenue}
          />
        </div>
        
        {isProfileLoading ? (
          <div className="w-full">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <CalendarHeader profileName={profile?.full_name} isLoading={isProfileLoading} />
        )}

        <div className="grid gap-6 lg:grid-cols-[420px,1fr] transition-all">
          <Card className="p-6 bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
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

          <Card className="p-6 bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-zinc-900">
                  {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                </h3>
                {isEventsLoading && (
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading events...
                  </div>
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
    </div>
  );
};

export default Calendar;