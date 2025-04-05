
import { useState, useCallback } from "react";
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
      console.log("Fetching events...");
      try {
        const {
          data,
          error
        } = await supabase.from("events").select("*").is("deleted_at", null).order("event_date", {
          ascending: true
        });
        
        if (error) {
          console.error("Supabase error fetching events:", error);
          throw error;
        }
        
        console.log("Events data received:", data ? data.length : 0, "events");
        return data as Event[];
      } catch (err) {
        console.error("Error fetching events:", err);
        return [];
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
  
  const handleDeleteEvent = useCallback((event: Event) => {
    setEventToDelete(event);
    setIsPermanentDelete(false); // Reset to soft delete by default
    setIsDeleteDialogOpen(true);
  }, []);
  
  const confirmDelete = useCallback(async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    
    try {
      if (isPermanentDelete) {
        // Permanent delete
        await permanentlyDeleteEvent(eventToDelete.event_code);
        toast.success("Event permanently deleted");
      } else {
        // Soft delete
        const { error } = await supabase
          .from("events")
          .update({ deleted_at: new Date().toISOString() })
          .eq("event_code", eventToDelete.event_code);
          
        if (error) {
          console.error("Supabase error during soft delete:", error);
          throw error;
        }
        
        toast.success("Event deleted successfully");
      }
      
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);

      // Invalidate all related queries to ensure updated data
      queryClient.invalidateQueries({
        queryKey: ["events"]
      });
      queryClient.invalidateQueries({
        queryKey: ["upcoming_events"]
      });
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error(`Failed to ${isPermanentDelete ? 'permanently delete' : 'delete'} event`);
    } finally {
      setIsDeleting(false);
    }
  }, [eventToDelete, isPermanentDelete, queryClient]);
  
  // Process events data
  const upcomingEvents = events?.filter(event => {
    if (!event.event_date) return true;
    return isAfter(parseISO(event.event_date), new Date());
  }) || [];
  
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
    setEventToDelete,
    handleDeleteEvent,
    confirmDelete,
    isDeleting,
    isPermanentDelete,
    setIsPermanentDelete
  };
}
