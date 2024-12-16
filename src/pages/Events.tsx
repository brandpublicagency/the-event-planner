import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/EventsTable";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/types/event";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Events() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("No authenticated user");
        }

        // Get today's date at the start of the day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error: fetchError } = await supabase
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
          .eq('created_by', user.id)
          .eq('completed', false)
          .gte('event_date', today.toISOString().split('T')[0])
          .order('event_date', { ascending: true });

        if (fetchError) {
          console.error('Error fetching events:', fetchError);
          throw fetchError;
        }

        console.log('Fetched events:', data);

        return data.map(event => ({
          ...event,
          venues: event.event_venues?.map((ev: any) => ev.venues) || []
        }));
      } catch (err) {
        console.error('Error in events query:', err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 30000,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading events",
        description: "There was a problem loading your events. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Group events by month and year
  const groupedEvents = events?.reduce((acc: Record<string, Event[]>, event) => {
    if (!event.event_date) return acc;
    const monthYear = format(new Date(event.event_date), 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {}) || {};

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => navigate('/events/new')}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              There was a problem loading your events.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : Object.keys(groupedEvents).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You don't have any upcoming events.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/events/new')}
            >
              Create Your First Event
            </Button>
          </div>
        ) : (
          <EventsTable groupedEvents={groupedEvents} />
        )}
      </div>
    </div>
  );
}