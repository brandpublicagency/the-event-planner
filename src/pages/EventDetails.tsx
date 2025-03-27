
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { EventDetailsLoading } from "@/components/event-details/EventDetailsLoading";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { EventDetailsError } from "@/components/event-details/EventDetailsError";
import { EventNotFoundHandler } from "@/components/events/event-details/EventNotFoundHandler";
import { useQuery } from "@tanstack/react-query";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch event data
  const { 
    data: event, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;

      console.log(`Fetching event with code: ${id}`);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq('event_code', id)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        throw error;
      }

      if (!data) {
        console.log(`No event found with code: ${id}`);
        throw new Error(`Event with code ${id} not found`);
      }

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // If loading show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50">
        <Header pageTitle="Event Details" showBackButton onBackButtonClick={() => navigate('/events')} />
        <EventDetailsLoading />
      </div>
    );
  }

  // If no event found (404)
  if (!event) {
    return <EventNotFoundHandler eventId={id} />;
  }

  // If there was an error fetching the event
  if (isError) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50">
        <Header pageTitle="Event Details" showBackButton onBackButtonClick={() => navigate('/events')} />
        <EventDetailsError error={error as Error} onRetry={() => navigate(0)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header 
        pageTitle={event.name || "Event Details"} 
        showBackButton 
        onBackButtonClick={() => navigate('/events')} 
      />
      <EventDetailsContent event={event} />
    </div>
  );
};

export default EventDetails;
