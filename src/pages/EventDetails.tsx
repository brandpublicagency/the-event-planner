
import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // Normalize the event ID for database queries
  const normalizedId = React.useMemo(() => {
    if (!id) return null;
    
    // For database queries, we need to ensure the EVENT- prefix is preserved
    // if it was in the original URL, otherwise add it
    if (id.startsWith('EVENT-')) {
      return id;
    } else if (id.startsWith('event_')) {
      // Convert event_ format to EVENT- format for querying
      return 'EVENT-' + id.replace('event_', '');
    } else if (id.includes('-')) {
      // If it's a bare ID like "253-2161", add the EVENT- prefix
      return 'EVENT-' + id;
    }
    
    return id; // Fallback
  }, [id]);

  console.log(`Event Details page with ID: ${id}, normalized for DB: ${normalizedId}`);

  // Check if this is a forced refresh
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const forceRefresh = searchParams.get('refresh');
    
    if (forceRefresh === 'true') {
      console.log('Forced refresh detected, refetching event data');
      refetch();
    }
  }, [location.search]);

  // Fetch event data
  const { 
    data: event, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['event', normalizedId],
    queryFn: async () => {
      if (!normalizedId) return null;

      console.log(`Fetching event with code: ${normalizedId}`);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq('event_code', normalizedId)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        throw error;
      }

      if (!data) {
        console.log(`No event found with code: ${normalizedId}`);
        throw new Error(`Event with code ${normalizedId} not found`);
      }

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const handleBackClick = () => {
    navigate('/events');
  };

  // If loading show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50">
        <Header pageTitle="Event Details" showBackButton onBackButtonClick={handleBackClick} />
        <EventDetailsLoading onBackButtonClick={handleBackClick} />
      </div>
    );
  }

  // If no event found (404)
  if (!event) {
    return <EventNotFoundHandler eventId={normalizedId ?? id} />;
  }

  // If there was an error fetching the event
  if (isError) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50">
        <Header pageTitle="Event Details" showBackButton onBackButtonClick={handleBackClick} />
        <EventDetailsError 
          error={error as Error} 
          onBackButtonClick={handleBackClick} 
          onRefetch={() => refetch()}
        />
      </div>
    );
  }

  // Prepare the formatted date for the event
  const formattedDate = event.event_date 
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Date not set';

  // Create mock data for the missing props required by EventDetailsContent
  const mockMenuState = null;
  const isCustomMenu = false;
  
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header 
        pageTitle={event.name || "Event Details"} 
        showBackButton 
        onBackButtonClick={handleBackClick} 
      />
      <EventDetailsContent 
        event={event}
        eventId={normalizedId || id || ''}
        formattedDate={formattedDate}
        isCustomMenu={isCustomMenu}
        menuState={mockMenuState}
        saveMenuFunction={null}
        isSaving={false}
        onEditEvent={() => navigate(`/events/${normalizedId || id}/edit`)}
        onCustomMenuToggle={() => {}}
        onMenuStateChange={() => {}}
        onSaveMenuSelections={() => {}}
        onSaveMenu={async () => {}}
      />
    </div>
  );
};

export default EventDetails;
