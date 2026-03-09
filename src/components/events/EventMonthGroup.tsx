
import React from "react";
import { EventCard } from "@/components/events/EventCard";
import { DashboardEventItem } from "@/components/events/DashboardEventItem";
import type { Event } from "@/types/event";
import { toast } from "@/hooks/use-toast";
import { deleteEvent, permanentlyDeleteEvent } from "@/utils/eventUtils";

interface EventMonthGroupProps {
  monthYear: string;
  events: Event[];
  onEdit?: (eventCode: string) => void;
  onView?: (eventCode: string) => void;
  onDelete?: (event: Event) => void;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
}

export const EventMonthGroup: React.FC<EventMonthGroupProps> = ({
  monthYear,
  events,
  onEdit,
  onView,
  onDelete,
  handleDelete: propHandleDelete,
  isDashboard = false
}) => {
  const handleDelete = async (eventCode: string, isPermanent: boolean = false) => {
    if (propHandleDelete) {
      return propHandleDelete(eventCode);
    }
    try {
      if (isPermanent) {
        const toastId = "permanent-delete-event";
        toast.loading("Permanently deleting event...", {
          id: toastId
        });
        await permanentlyDeleteEvent(eventCode);
        toast.success("Event permanently deleted", {
          id: toastId
        });
      } else {
        const toastId = "soft-delete-event";
        toast.loading("Deleting event...", {
          id: toastId
        });
        await deleteEvent(eventCode);
        toast.success("Event deleted", {
          id: toastId
        });
      }

      // If this component is rendered on the events page, refetch the events
      if (window.location.pathname === "/events" || window.location.pathname === "/events/passed") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="bg-transparent">
      <h3 className="text-foreground text-lg font-semibold mb-2">{monthYear}</h3>
      <div className="bg-transparent rounded-lg overflow-hidden space-y-2">
        {events.map((event) =>
          <EventCard
            key={event.event_code}
            event={event}
            handleDelete={handleDelete}
            isDashboard={isDashboard}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete} />
        )}
      </div>
    </div>);

};