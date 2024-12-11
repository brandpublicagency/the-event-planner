import { Button } from "@/components/ui/button";
import { Plus, Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import EventsTable from "@/components/EventsTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/types/event";
import { groupEventsByMonth, markEventAsCompleted } from "@/utils/eventUtils";
import Papa from 'papaparse';

const Events = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
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
        .eq('completed', false)
        .order('event_date', { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
        throw error;
      }

      return data?.map(event => ({
        ...event,
        venues: event.event_venues?.map(ev => ({
          id: ev.venues?.id,
          name: ev.venues?.name
        })) || []
      })) as Event[];
    },
  });

  // Check for passed events and mark them as completed
  useEffect(() => {
    const checkPassedEvents = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const passedEvents = events.filter(event => {
        if (!event.event_date) return false;
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
      });

      for (const event of passedEvents) {
        try {
          await markEventAsCompleted(event.event_code);
        } catch (error) {
          console.error(`Failed to mark event ${event.event_code} as completed:`, error);
        }
      }

      if (passedEvents.length > 0) {
        // Refetch events to update the list
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }
    };

    checkPassedEvents();
  }, [events, queryClient]);

  const groupedEvents = groupEventsByMonth(events);

  const filteredEvents = Object.entries(groupedEvents).reduce(
    (acc: Record<string, Event[]>, [monthYear, monthEvents]) => {
      const filteredMonthEvents = monthEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.event_code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredMonthEvents.length > 0) {
        acc[monthYear] = filteredMonthEvents;
      }
      return acc;
    },
    {}
  );

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const events = results.data as Array<{
          name: string;
          event_type: string;
          event_date: string;
          pax?: string;
          description?: string;
          client_address?: string;
        }>;

        let successCount = 0;
        let errorCount = 0;

        for (const event of events) {
          try {
            const eventCode = event.name.toLowerCase().replace(/\s+/g, '-');
            const { data, error } = await supabase.rpc('generate_unique_event_code', {
              base_code: eventCode
            });

            if (error) throw error;

            const { error: insertError } = await supabase
              .from('events')
              .insert({
                event_code: data,
                name: event.name,
                event_type: event.event_type,
                event_date: event.event_date,
                pax: event.pax ? parseInt(event.pax) : null,
                description: event.description || null,
                client_address: event.client_address || null,
              });

            if (insertError) throw insertError;
            successCount++;
          } catch (error) {
            console.error('Error importing event:', error);
            errorCount++;
          }
        }

        toast({
          title: "Import Complete",
          description: `Successfully imported ${successCount} events. ${errorCount} failed.`,
          variant: errorCount > 0 ? "destructive" : "default",
        });

        refetch();
      },
      error: (error) => {
        toast({
          title: "Import Failed",
          description: "Failed to parse CSV file: " + error.message,
          variant: "destructive",
        });
      }
    });
  };

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Error loading events. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">Manage your events and bookings</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="file"
            accept=".csv"
            className="hidden"
            id="csv-upload"
            onChange={handleImportCSV}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('csv-upload')?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button 
            onClick={() => navigate('/events/new')}
            className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <EventsTable 
          groupedEvents={filteredEvents}
          handleDelete={async (eventCode: string) => {
            try {
              const { error } = await supabase
                .from('events')
                .delete()
                .eq('event_code', eventCode);

              if (error) throw error;

              toast({
                title: "Success",
                description: "Event deleted successfully",
              });

              refetch();
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to delete event",
                variant: "destructive",
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default Events;
