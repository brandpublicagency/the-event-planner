
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { EventDetailsLoading } from "@/components/event-details/EventDetailsLoading";
import { EventDetailsError } from "@/components/event-details/EventDetailsError";
import { EventDetailsEmpty } from "@/components/event-details/EventDetailsEmpty";
import { EventNotFoundHandler } from "@/components/events/event-details/EventNotFoundHandler";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notFound, setNotFound] = useState(false);

  const {
    data: event,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("event_code", id)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        console.log(`Event not found: ${id}`);
        setNotFound(true);
        return null;
      }

      return data;
    },
    enabled: !!id,
    retry: 1, // Only retry once to avoid too many requests for non-existent events
  });

  const handleBackClick = () => {
    navigate("/events");
  };

  if (notFound) {
    return <EventNotFoundHandler eventId={id} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50">
        <Header 
          pageTitle="Event Details" 
          showBackButton 
          onBackButtonClick={handleBackClick} 
        />
        <EventDetailsLoading />
      </div>
    );
  }

  if (error) {
    return (
      <EventDetailsError 
        error={error} 
        onBackButtonClick={handleBackClick}
        onRefetch={refetch}
      />
    );
  }

  if (!event) {
    return (
      <EventDetailsEmpty 
        onBackButtonClick={handleBackClick} 
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header 
        pageTitle={`Event: ${event.name}`} 
        showBackButton 
        onBackButtonClick={handleBackClick} 
      />
      <EventDetailsContent event={event} />
    </div>
  );
};

export default EventDetails;
