
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useEvents } from "@/hooks/useEvents";
import { EventsList } from "@/components/events/EventsList";
import { DeleteEventDialog } from "@/components/events/DeleteEventDialog";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    groupedUpcomingEvents,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    eventToDelete,
    handleDeleteEvent,
    confirmDelete,
    isDeleting,
    isPermanentDelete,
    setIsPermanentDelete
  } = useEvents();
  
  // Filter events based on search query
  const filteredEvents = Object.entries(groupedUpcomingEvents).reduce(
    (acc: Record<string, any[]>, [monthYear, monthEvents]) => {
      if (!searchQuery) {
        acc[monthYear] = monthEvents;
        return acc;
      }
      
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
  
  return (
    <div className="flex flex-col h-full">
      <Header title="Upcoming Events" />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <EventsList 
          groupedEvents={filteredEvents} 
          isLoading={isLoading}
          onDelete={handleDeleteEvent} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alternateLink={{
            path: "/events/passed",
            label: "Passed Events"
          }}
        />
      </div>

      <DeleteEventDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        event={eventToDelete}
        onDelete={confirmDelete}
        isPermanentDelete={isPermanentDelete}
        onPermanentDeleteChange={setIsPermanentDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Events;
