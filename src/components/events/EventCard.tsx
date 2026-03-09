
import React from "react";
import { getVenueNames } from "@/utils/venueUtils";
import type { Event } from "@/types/event";
import { EventCardContent } from "./card/EventCardContent";
import { EventCardActions } from "./card/EventCardActions";
import { EventDeleteDialog } from "./card/EventDeleteDialog";
import { useEventCardState } from "./card/useEventCardState";

interface EventCardProps {
  event: Event;
  handleDelete?: (eventCode: string, isPermanent?: boolean) => Promise<void>;
  isDashboard?: boolean;
  onEdit?: (eventCode: string) => void;
  onView?: (eventCode: string) => void;
  onDelete?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  handleDelete,
  isDashboard = false,
  onEdit,
  onView,
  onDelete
}) => {
  const {
    name,
    event_code
  } = event;
  const venueStr = getVenueNames(event);
  
  const {
    isDeleting,
    setIsDeleting,
    isPermanentDelete,
    setIsPermanentDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  } = useEventCardState();
  
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (handleDelete) {
        await handleDelete(event_code, isPermanentDelete);
      } else if (onDelete) {
        onDelete(event);
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="p-2.5 transition-colors w-full bg-white rounded-lg mb-1.5 border border-gray-100">
      <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between w-full">
        <EventCardContent event={event} venueStr={venueStr} />
        
        <div className="flex space-x-1 justify-end">
          <EventCardActions 
            event={event} 
            isDashboard={isDashboard} 
            onEdit={onEdit} 
            onView={onView} 
            onDelete={onDelete ? () => setIsDeleteDialogOpen(true) : undefined} 
          />
        </div>
      </div>
      
      <EventDeleteDialog 
        isOpen={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        eventName={name} 
        eventCode={event_code} 
        isPermanentDelete={isPermanentDelete} 
        onPermanentDeleteChange={setIsPermanentDelete} 
        isDeleting={isDeleting} 
        onConfirmDelete={confirmDelete} 
      />
    </div>
  );
};
