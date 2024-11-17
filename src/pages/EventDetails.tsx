import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Printer, Copy, Edit, ArrowLeft } from "lucide-react";
import WeddingMenuPlanner from "@/components/WeddingMenuPlanner";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/types/event";

const EventDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

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
            event_venues (
              venues (
                id,
                name
              )
            )
          `)
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

  const handleCopyEventCode = async () => {
    if (event?.event_code) {
      await navigator.clipboard.writeText(event.event_code);
      toast({
        description: "Event code copied to clipboard",
      });
    }
  };

  const handleEditBasicDetails = () => {
    if (event?.event_code) {
      navigate(`/events/${event.event_code}/edit`);
    }
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to load event details';
    return (
      <div className="flex-1 p-8">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Event</h2>
            <p className="text-red-600 mb-4">{errorMessage}</p>
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
    <div className="flex-1 p-4 md:p-8 print:p-0 print:m-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/events')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEditBasicDetails}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Details
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        <Card className="border-zinc-200 print:border-none print:shadow-none">
          <CardContent className="p-6 print:p-0">
            <div className="print:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold tracking-tight print:text-xl">{event.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {event.event_code}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="print:hidden p-0 h-6 w-6"
                    onClick={handleCopyEventCode}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-zinc-600 print:text-sm">
                <Badge variant="secondary">{formattedDate}</Badge>
                {formattedTime && <Badge variant="secondary">{formattedTime}</Badge>}
                <Badge variant="secondary">{event.event_type}</Badge>
                <Badge variant="secondary">{event.pax || 'No'} Guests</Badge>
                <Badge variant="secondary">{venueNames}</Badge>
              </div>
            </div>

            <div className="mt-8 print:block">
              <WeddingMenuPlanner eventCode={event.event_code} eventName={event.name} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;