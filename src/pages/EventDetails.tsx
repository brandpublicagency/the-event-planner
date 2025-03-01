
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import WeddingMenuPlanner from "@/components/WeddingMenuPlanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/types/event";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventInfo } from "@/components/event-details/EventInfo";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCustomMenu, setIsCustomMenu] = React.useState(false);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_venues!inner(
              venues(
                id,
                name
              )
            )`)
          .eq('event_code', id)
          .maybeSingle();

        clearTimeout(timeoutId);

        if (error) throw error;
        if (!data) throw new Error('Event not found');

        return {
          ...data,
          venues: data.event_venues?.map(ev => ({
            id: ev.venues?.id,
            name: ev.venues?.name
          })) || []
        } as Event;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Event</h2>
            <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'Failed to load event details'}</p>
            <Button 
              onClick={() => navigate('/events')} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-1 p-8">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">Event Not Found</h2>
            <p className="text-yellow-600 mb-4">The event you're looking for doesn't exist or has been deleted.</p>
            <Button 
              onClick={() => navigate('/events')} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'No date';
  const formattedTime = event.start_time && event.end_time ? `${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)}` : '';
  const venueNames = event.venues?.map(venue => venue.name).join(' + ') || 'No venues';

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="print:hidden">
          <EventHeader 
            eventCode={event.event_code} 
            onPrint={handlePrint} 
            isCustomMenu={isCustomMenu}
            onCustomMenuToggle={setIsCustomMenu}
          />
        </div>
        
        <div className="print-container bg-white rounded-lg border border-zinc-100">
          <div className="print-header">
            <h1 className="hidden print:block text-2xl font-semibold mb-2">Menu Selection</h1>
            {event.name && <h2 className="hidden print:block text-xl text-zinc-500">{event.name}</h2>}
          </div>
          
          <div className="print:block">
            <EventInfo 
              event={event}
              formattedDate={formattedDate}
              formattedTime={formattedTime}
              venueNames={venueNames}
            />
          </div>
          
          <div className="px-6 pb-8">
            <WeddingMenuPlanner 
              eventCode={event.event_code} 
              eventName={event.name}
              isCustomMenu={isCustomMenu}
              onCustomMenuToggle={setIsCustomMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
