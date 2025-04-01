
import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { EventDetailsLoading } from "@/components/event-details/EventDetailsLoading";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { EventDetailsError } from "@/components/event-details/EventDetailsError";
import { EventNotFoundHandler } from "@/components/events/event-details/EventNotFoundHandler";
import { useQuery } from "@tanstack/react-query";
import { useEventMenu } from "@/hooks/useEventMenu"; // Make sure this import is present

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Normalize the event ID for database queries
  const normalizedId = React.useMemo(() => {
    if (!id) return null;
    
    // For database queries, we need to use the ID exactly as it appears in the URL
    // The backend will handle any necessary normalization
    console.log(`Original ID from URL: ${id}`);
    return id;
  }, [id]);

  console.log(`Event Details page with ID: ${id}, using for DB query: ${normalizedId}`);

  // Check if this is a forced refresh or returning from edit
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const forceRefresh = searchParams.get('refresh');
    const fromEdit = searchParams.get('from') === 'edit';
    
    if (forceRefresh === 'true' || fromEdit) {
      console.log('Forced refresh or return from edit detected, refetching event data');
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

      console.log(`Fetching event with ID: ${normalizedId}`);
      try {
        // First attempt: try exact match on event_code
        let { data, error } = await supabase
          .from("events")
          .select("*")
          .eq('event_code', normalizedId)
          .single();

        if (error || !data) {
          console.log(`No exact match found for event_code: ${normalizedId}, trying with EVENT- prefix`);
          
          // Second attempt: try with EVENT- prefix
          const prefixedId = normalizedId.startsWith('EVENT-') ? normalizedId : `EVENT-${normalizedId}`;
          
          ({ data, error } = await supabase
            .from("events")
            .select("*")
            .eq('event_code', prefixedId)
            .single());
            
          if (error || !data) {
            // Third attempt: if prefixed ID contains dashes, try without EVENT- prefix
            if (normalizedId.includes('-') && normalizedId.startsWith('EVENT-')) {
              const unprefixedId = normalizedId.replace('EVENT-', '');
              console.log(`Trying without EVENT- prefix: ${unprefixedId}`);
              
              ({ data, error } = await supabase
                .from("events")
                .select("*")
                .eq('event_code', unprefixedId)
                .single());
            }
          }
        }

        if (error) {
          console.error("Error fetching event:", error);
          throw error;
        }

        if (!data) {
          console.log(`No event found with any of the attempted IDs`);
          throw new Error(`Event not found`);
        }

        console.log(`Event found:`, data);
        return data;
      } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 0 // Set to 0 to ensure fresh data on each visit
  });

  // Initialize the menu state management - Add this if it's missing
  const {
    isCustomMenu,
    setIsCustomMenu,
    isSaving,
    menuState,
    handleSaveMenu,
    setSaveMenuFunction,
    setMenuState
  } = useEventMenu(id);

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
  const formattedDate = event?.event_date 
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Date not set';
  
  // Function to handle custom menu toggle
  const handleCustomMenuToggle = (checked: boolean) => {
    setIsCustomMenu(checked);
  };
  
  // Function to handle menu state changes
  const handleMenuStateChange = (newMenuState: any) => {
    setMenuState(newMenuState);
  };
  
  // Function to register save function
  const handleSaveMenuSelections = (saveFn: () => Promise<void>) => {
    console.log('Save function registered in EventDetails');
    setSaveMenuFunction(saveFn);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header 
        pageTitle={event?.name || "Event Details"} 
        showBackButton 
        onBackButtonClick={handleBackClick} 
      />
      {event && (
        <EventDetailsContent 
          event={event}
          eventId={normalizedId || id || ''}
          formattedDate={formattedDate}
          isCustomMenu={isCustomMenu}
          menuState={menuState}
          saveMenuFunction={handleSaveMenu}
          isSaving={isSaving}
          onEditEvent={() => navigate(`/events/${normalizedId || id}/edit`)}
          onCustomMenuToggle={handleCustomMenuToggle}
          onMenuStateChange={handleMenuStateChange}
          onSaveMenuSelections={handleSaveMenuSelections}
          onSaveMenu={handleSaveMenu}
        />
      )}
    </div>
  );
};

export default EventDetails;
