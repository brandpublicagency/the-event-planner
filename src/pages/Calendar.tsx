
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { EventsList } from "@/components/calendar/EventsList";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { GoogleCalendarButton } from "@/components/calendar/GoogleCalendarButton";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'true') {
      setCalendarConnected(true);
      toast({
        title: "Calendar Connected",
        description: "Successfully connected to Google Calendar",
      });
      
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: `Failed to connect to Google Calendar: ${error}`,
      });
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

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

  const { data: events = [], isLoading: isEventsLoading, error: eventsError } = useQuery({
    queryKey: ['events', date?.getMonth(), date?.getFullYear()],
    queryFn: async () => {
      if (!date) return [];

      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      let query = supabase
        .from('events')
        .select(`*`)
        .gte('event_date', startOfMonth.toISOString())
        .lte('event_date', endOfMonth.toISOString())
        .order('event_date');

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error loading events",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
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
    <div className="flex flex-col h-full">
      <Header
        pageTitle={date ? format(date, "MMMM d, yyyy") : "Calendar"}
        secondaryAction={<GoogleCalendarButton />}
      />
      
      <div className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-[420px,1fr] transition-all">
          <Card className="p-6 bg-white border border-zinc-200 transition-colors">
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

          <Card className="p-6 bg-white border border-zinc-200 transition-colors">
            <div className="space-y-4">
              {isEventsLoading && (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading events...
                </div>
              )}
              
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
