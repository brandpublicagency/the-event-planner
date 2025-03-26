import React from "react";
import { EventCard } from "@/components/events/EventCard";
import { DashboardEventItem } from "@/components/events/DashboardEventItem";
import type { Event } from "@/types/event";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
      if (window.location.pathname === "/events") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };
  return <div>
      <h3 className="mb-2 px-[10px] text-gray-800 py-[10px] font-normal text-lg">{monthYear}</h3>
      <div className="rounded-lg overflow-hidden divide-y divide-gray-100 bg-transparent">
        {events.map(event => isDashboard ? <DashboardEventItem key={event.event_code} event={event} handleDelete={handleDelete} isDashboard={isDashboard} /> : <EventCard key={event.event_code} event={event} handleDelete={handleDelete} isDashboard={isDashboard} onEdit={onEdit} onView={onView} onDelete={onDelete} />)}
      </div>
    </div>;
};