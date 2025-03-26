
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Edit } from "lucide-react";
import { Header } from "@/components/layout/Header";
import type { Event } from "@/types/event";
import { useEventMenu } from "@/hooks/useEventMenu";
import { EventDetailsLoading } from "@/components/event-details/EventDetailsLoading";
import { EventDetailsError } from "@/components/event-details/EventDetailsError";
import { EventDetailsEmpty } from "@/components/event-details/EventDetailsEmpty";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { toast } from "@/hooks/use-toast";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    isCustomMenu,
    setIsCustomMenu,
    isSaving,
    saveMenuFunction,
    setSaveMenuFunction,
    menuState,
    setMenuState,
    isInitialized,
    handleSaveMenu
  } = useEventMenu(id);
  
  const handleBackNavigation = useCallback(() => {
    if (location.state?.previousPath === 'menu-selection') {
      navigate('/menu-selection');
    } else {
      navigate('/events');
    }
  }, [location.state, navigate]);
  
  const {
    data: event,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('event_code', id)
          .maybeSingle();
        
        clearTimeout(timeoutId);
        if (error) throw error;
        if (!data) throw new Error('Event not found');
        return data as Event;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000
  });
  
  const handleSaveMenuSelections = useCallback((saveFn: () => Promise<void>) => {
    console.log("Registering save menu function");
    setSaveMenuFunction(() => saveFn);
  }, [setSaveMenuFunction]);
  
  const handleEditEvent = useCallback(() => {
    if (id) {
      navigate(`/events/${id}/edit`);
    }
  }, [id, navigate]);
  
  if (isLoading) {
    return <EventDetailsLoading onBackButtonClick={handleBackNavigation} />;
  }
  
  if (error) {
    return <EventDetailsError 
      error={error} 
      onBackButtonClick={handleBackNavigation} 
      onRefetch={refetch} 
    />;
  }
  
  if (!event) {
    return <EventDetailsEmpty onBackButtonClick={handleBackNavigation} />;
  }
  
  const formattedDate = event?.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'No date';
  
  return (
    <div className="flex flex-col h-full">
      <Header 
        showBackButton 
        onBackButtonClick={handleBackNavigation}
        actionButton={{
          label: "Edit Event",
          icon: <Edit className="h-4 w-4 mr-1" />,
          onClick: handleEditEvent,
          variant: "outline"
        }}
      />
      
      <EventDetailsContent
        event={event}
        eventId={id || ''}
        formattedDate={formattedDate}
        isCustomMenu={isCustomMenu}
        menuState={menuState}
        saveMenuFunction={saveMenuFunction}
        isSaving={isSaving}
        onEditEvent={handleEditEvent}
        onCustomMenuToggle={setIsCustomMenu}
        onMenuStateChange={setMenuState}
        onSaveMenuSelections={handleSaveMenuSelections}
        onSaveMenu={handleSaveMenu}
      />
    </div>
  );
};

export default EventDetails;
