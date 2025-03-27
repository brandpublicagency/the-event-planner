
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Header } from "@/components/layout/Header";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { EventDetailsLoading } from "@/components/event-details/EventDetailsLoading";
import { EventDetailsError } from "@/components/event-details/EventDetailsError";
import { EventDetailsEmpty } from "@/components/event-details/EventDetailsEmpty";
import { EventNotFoundHandler } from "@/components/events/event-details/EventNotFoundHandler";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MenuState } from "@/hooks/menuStateTypes";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notFound, setNotFound] = useState(false);
  const [isCustomMenu, setIsCustomMenu] = useState(false);
  const [menuState, setMenuState] = useState<MenuState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMenuFunction, setSaveMenuFunction] = useState<(() => Promise<void>) | null>(null);

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

  // Format date for display
  const formattedDate = event?.event_date 
    ? format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')
    : 'Date not specified';

  // Handlers for menu state
  const handleCustomMenuToggle = (checked: boolean) => {
    setIsCustomMenu(checked);
  };

  const handleMenuStateChange = (newMenuState: MenuState) => {
    setMenuState(newMenuState);
  };

  const handleSaveMenuSelections = (saveFn: () => Promise<void>) => {
    setSaveMenuFunction(() => saveFn);
  };

  const handleSaveMenu = async () => {
    if (saveMenuFunction) {
      setIsSaving(true);
      try {
        await saveMenuFunction();
        toast({
          title: "Menu saved",
          description: "Your menu selections have been saved."
        });
      } catch (error) {
        console.error("Failed to save menu:", error);
        toast({
          title: "Failed to save",
          description: "There was an error saving your menu selections.",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleEditEvent = () => {
    if (id) {
      navigate(`/events/${id}/edit`);
    }
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
        <EventDetailsLoading onBackButtonClick={handleBackClick} />
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
      <EventDetailsContent 
        event={event}
        eventId={id || ''}
        formattedDate={formattedDate}
        isCustomMenu={isCustomMenu}
        menuState={menuState}
        saveMenuFunction={saveMenuFunction}
        isSaving={isSaving}
        onEditEvent={handleEditEvent}
        onCustomMenuToggle={handleCustomMenuToggle}
        onMenuStateChange={handleMenuStateChange}
        onSaveMenuSelections={handleSaveMenuSelections}
        onSaveMenu={handleSaveMenu}
      />
    </div>
  );
};

export default EventDetails;
