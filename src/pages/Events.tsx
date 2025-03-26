
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useEvents } from "@/hooks/useEvents";
import { EventsList } from "@/components/events/EventsList";
import { DeleteEventDialog } from "@/components/events/DeleteEventDialog";

const Events = () => {
  const navigate = useNavigate();
  const { 
    groupedUpcomingEvents,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    eventToDelete,
    handleDeleteEvent,
    confirmDelete,
    isDeleting,
    isPermanentDelete,
    setIsPermanentDelete
  } = useEvents();
  
  return (
    <div className="flex flex-col h-full">
      <Header title="Upcoming Events" />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <EventsList 
          groupedEvents={groupedUpcomingEvents} 
          onDelete={handleDeleteEvent} 
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
