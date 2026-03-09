import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { EventDetailsLoading } from "@/components/event-details/EventDetailsLoading";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { EventDetailsError } from "@/components/event-details/EventDetailsError";
import { EventNotFoundHandler } from "@/components/events/event-details/EventNotFoundHandler";
import { useEventDetails } from "@/hooks/useEventDetails";

const EventDetails = () => {
  const navigate = useNavigate();
  
  // Use the extracted hook for event details
  const {
    event,
    eventId,
    isLoading,
    isError,
    error,
    refetch,
    formattedDate
  } = useEventDetails();

  const handleBackClick = () => {
    navigate('/events');
  };

  // If loading show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header pageTitle="Event Details" showBackButton onBackButtonClick={handleBackClick} />
        <EventDetailsLoading onBackButtonClick={handleBackClick} />
      </div>
    );
  }

  // If no event found (404)
  if (!event) {
    return <EventNotFoundHandler eventId={eventId ?? ''} />;
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
          eventId={eventId || ''}
          formattedDate={formattedDate}
          onEditEvent={() => navigate(`/events/${eventId}/edit`)}
        />
      )}
    </div>
  );
};

export default EventDetails;