
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, ExternalLink } from "lucide-react";
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
import { Button } from "@/components/ui/button";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [calendarConnected, setCalendarConnected] = useState(false);
  const queryClient = useQueryClient();

  const checkCalendarConnection = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL || 'https://www.warmkaroo.app'}/functions/v1/check-calendar-connection`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        }
      );
      
      const data = await response.json();
      console.log('Cal.com connection status:', data);
      
      if (data.connected) {
        setCalendarConnected(true);
        toast({
          title: "Calendar Connected",
          description: "Successfully connected to Cal.com Calendar!",
        });
      }
    } catch (error) {
      console.error('Error checking Cal.com connection:', error);
    }
  };

  useEffect(() => {
    checkCalendarConnection();
    
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('cal_success');
    
    if (success === 'true') {
      setCalendarConnected(true);
      toast({
        title: "Calendar Connected",
        description: "Successfully connected to Cal.com Calendar!",
      });
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const refreshEvents = () => {
    queryClient.invalidateQueries({ queryKey: ['events', date?.getMonth(), date?.getFullYear()] });
  };

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

  const handleEventSync = () => {
    refreshEvents();
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        pageTitle={date ? format(date, "MMMM d, yyyy") : "Calendar"}
        secondaryAction={
          <div className="flex items-center">
            <GoogleCalendarButton connected={calendarConnected} onSync={handleEventSync} />
          </div>
        }
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
              
              {calendarConnected && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-2">Need to schedule a new event?</h3>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      window.open('https://cal.com/your-cal-link', '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Open Cal.com Booking Page <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
