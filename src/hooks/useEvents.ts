
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAfter, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { permanentlyDeleteEvent } from "@/utils/eventUtils";
import type { Event } from "@/types/event";

export function useEvents() {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  
  const {
    data: events = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      toast.info("Loading events...", {
        id: "loading-events",
        duration: 0 // No auto dismiss 
      });
      try {
        const {
          data,
          error
        } = await supabase.from("events").select("*").is("deleted_at", null).order("event_date", {
          ascending: true
        });
        if (error) throw error;
        toast.success("Events loaded successfully", {
          id: "loading-events",
          duration: 1500
        });
        return data as Event[];
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to load events", {
          id: "loading-events",
          duration: 5000
        });
        return [];
      }
    }
  });
  
  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setIsPermanentDelete(false); // Reset to soft delete by default
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    
    const toastId = "delete-event";
    toast.info(`${isPermanentDelete ? 'Permanently deleting' : 'Deleting'} event...`, {
      id: toastId,
      duration: 0 // No auto dismiss
    });
    
    try {
      if (isPermanentDelete) {
        // Permanent delete
        await permanentlyDeleteEvent(eventToDelete.event_code);
        toast.success("Event permanently deleted", {
          id: toastId,
          duration: 3000
        });
      } else {
        // Soft delete
        const { error } = await supabase
          .from("events")
          .update({ deleted_at: new Date().toISOString() })
          .eq("event_code", eventToDelete.event_code);
          
        if (error) throw error;
        
        toast.success("Event deleted successfully", {
          id: toastId,
          duration: 3000
        });
      }
      
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      queryClient.invalidateQueries({
        queryKey: ["events"]
      });
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error(`Failed to ${isPermanentDelete ? 'permanently delete' : 'delete'} event`, {
        id: toastId,
        duration: 5000
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Process events data
  const upcomingEvents = events.filter(event => {
    if (!event.event_date) return true;
    return isAfter(parseISO(event.event_date), new Date());
  });
  
  const groupedUpcomingEvents = upcomingEvents.reduce((groups, event) => {
    if (!event.event_date) {
      if (!groups["No Date"]) groups["No Date"] = [];
      groups["No Date"].push(event);
      return groups;
    }
    const month = new Date(event.event_date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
    if (!groups[month]) groups[month] = [];
    groups[month].push(event);
    return groups;
  }, {} as Record<string, Event[]>);
  
  return {
    events,
    isLoading,
    error,
    refetch,
    groupedUpcomingEvents,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    eventToDelete,
    handleDeleteEvent,
    confirmDelete,
    isDeleting,
    isPermanentDelete,
    setIsPermanentDelete
  };
}
