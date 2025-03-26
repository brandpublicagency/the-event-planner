
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { isAfter, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { EventsTable } from "@/components/events/EventsTable";
import { EventCard } from "@/components/events/EventCard";
import { EventMonthGroup } from "@/components/events/EventMonthGroup";
import { Header } from "@/components/layout/Header";
import type { Event } from "@/types/event";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { permanentlyDeleteEvent } from "@/utils/eventUtils";

const Events = () => {
  const navigate = useNavigate();
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
  
  // Find potential duplicate events
  const findDuplicates = (events: Event[]) => {
    const eventsByName: Record<string, Event[]> = {};
    
    events.forEach(event => {
      if (!eventsByName[event.name]) {
        eventsByName[event.name] = [];
      }
      eventsByName[event.name].push(event);
    });
    
    // Return only the groups that have more than 1 event with the same name
    return Object.entries(eventsByName)
      .filter(([_, eventsGroup]) => eventsGroup.length > 1)
      .reduce((acc, [name, eventsGroup]) => {
        acc[name] = eventsGroup;
        return acc;
      }, {} as Record<string, Event[]>);
  };
  
  const duplicateEvents = findDuplicates(events);
  const hasDuplicates = Object.keys(duplicateEvents).length > 0;
  
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
  
  return (
    <div className="flex flex-col h-full">
      <Header title="Upcoming Events" />

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {hasDuplicates && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Potential Duplicate Events Detected</h3>
            <p className="text-amber-700 mb-3">We found events with identical names that might be duplicates:</p>
            
            <div className="space-y-4">
              {Object.entries(duplicateEvents).map(([eventName, duplicates]) => (
                <div key={eventName} className="bg-white p-4 rounded border border-amber-100">
                  <h4 className="font-medium text-amber-900 mb-2">{eventName}</h4>
                  <div className="space-y-2">
                    {duplicates.map(event => (
                      <div key={event.event_code} className="flex items-center justify-between p-2 bg-amber-50 rounded">
                        <div>
                          <span className="text-sm font-medium">{event.event_code}</span>
                          {event.event_date && (
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(event.event_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteEvent(event)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="w-full mt-[25px] px-[5px]">
          <div className="space-y-8">
            {Object.entries(groupedUpcomingEvents).map(([month, monthEvents]) => (
              <EventMonthGroup 
                key={month} 
                monthYear={month} 
                events={monthEvents} 
                onEdit={eventCode => navigate(`/events/${eventCode}/edit`)} 
                onView={eventCode => navigate(`/events/${eventCode}`)} 
                onDelete={handleDeleteEvent} 
              />
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">
                This will delete the event "
                {eventToDelete?.name || "Unknown Event"}".
              </p>
              
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                <Switch 
                  id="permanent-delete" 
                  checked={isPermanentDelete}
                  onCheckedChange={setIsPermanentDelete}
                />
                <Label htmlFor="permanent-delete" className="font-medium text-red-600">
                  Permanently delete from database
                </Label>
              </div>
              
              {isPermanentDelete ? (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
                  <p className="font-semibold mb-1">Warning: This is permanent!</p>
                  <p className="text-sm">
                    This will completely remove the event and all associated data from the database.
                    This action cannot be undone.
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  The event will be marked as deleted but can be recovered from the database if needed.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className={`${isPermanentDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-destructive hover:bg-destructive/90'} text-destructive-foreground`}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isPermanentDelete ? 'Permanently Deleting...' : 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  {isPermanentDelete ? 'Permanently Delete' : 'Delete'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Events;
