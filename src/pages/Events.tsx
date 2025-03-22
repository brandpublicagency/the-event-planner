
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, CalendarDays, Filter, Trash2, Calendar } from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Events = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"table" | "cards">("cards");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get events
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      toast.info("Loading events...", { 
        id: "loading-events",
        duration: 0, // No auto dismiss 
      });

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .is("deleted_at", null)
          .order("event_date", { ascending: true });

        if (error) throw error;

        // Dismiss the loading toast on success
        toast.success("Events loaded successfully", { 
          id: "loading-events", 
          duration: 1500 
        });
        
        return data as Event[];
      } catch (err) {
        console.error("Error fetching events:", err);
        
        // Show error toast
        toast.error("Failed to load events", { 
          id: "loading-events", 
          duration: 5000 
        });
        
        return [];
      }
    },
  });

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    
    toast.info("Deleting event...", {
      id: "delete-event",
      duration: 0, // No auto dismiss
    });

    try {
      // Soft delete by updating the deleted_at field
      const { error } = await supabase
        .from("events")
        .update({ deleted_at: new Date().toISOString() })
        .eq("event_code", eventToDelete.event_code);

      if (error) throw error;

      // Show success message
      toast.success("Event deleted successfully", {
        id: "delete-event",
        duration: 3000,
      });

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);

      // Invalidate the events query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (err) {
      console.error("Error deleting event:", err);
      
      // Show error message
      toast.error("Failed to delete event", {
        id: "delete-event",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter events by upcoming/passed
  const upcomingEvents = events.filter((event) => {
    if (!event.event_date) return true; // If no date, show in upcoming
    return isAfter(parseISO(event.event_date), new Date());
  });

  const passedEvents = events.filter((event) => {
    if (!event.event_date) return false; // If no date, don't show in passed
    return !isAfter(parseISO(event.event_date), new Date());
  });

  // Group events by month for card view
  const groupedUpcomingEvents = upcomingEvents.reduce((groups, event) => {
    if (!event.event_date) {
      if (!groups["No Date"]) groups["No Date"] = [];
      groups["No Date"].push(event);
      return groups;
    }

    const month = format(parseISO(event.event_date), "MMMM yyyy");
    if (!groups[month]) groups[month] = [];
    groups[month].push(event);
    return groups;
  }, {} as Record<string, Event[]>);

  // Content for each view type
  const renderCardView = () => {
    return (
      <div className="space-y-8">
        {Object.entries(groupedUpcomingEvents).map(([month, monthEvents]) => (
          <EventMonthGroup
            key={month}
            month={month}
            events={monthEvents}
            onEdit={(eventCode) => navigate(`/events/${eventCode}/edit`)}
            onView={(eventCode) => navigate(`/events/${eventCode}`)}
            onDelete={handleDeleteEvent}
          />
        ))}

        {Object.keys(groupedUpcomingEvents).length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No upcoming events found. Create your first event!
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderTableView = () => {
    return (
      <EventsTable
        events={upcomingEvents}
        isLoading={isLoading}
        onEdit={(eventCode) => navigate(`/events/${eventCode}/edit`)}
        onView={(eventCode) => navigate(`/events/${eventCode}`)}
        onDelete={handleDeleteEvent}
      />
    );
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Events">
        <Button
          onClick={() => navigate("/calendar")}
          variant="outline"
          size="sm"
          className="mr-2"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Calendar
        </Button>
        {view === "table" ? (
          <Button
            onClick={() => setView("cards")}
            variant="outline"
            size="sm"
            className="mr-2"
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Card View
          </Button>
        ) : (
          <Button
            onClick={() => setView("table")}
            variant="outline"
            size="sm"
            className="mr-2"
          >
            <Filter className="h-4 w-4 mr-1" />
            Table View
          </Button>
        )}
        <Button
          onClick={() => navigate("/events/new")}
          size="sm"
          variant="default"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Event
        </Button>
      </Header>

      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <div className="container max-w-5xl">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="passed">
                <Link to="/events/passed">Passed Events</Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {view === "cards" ? renderCardView() : renderTableView()}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the event "
              {eventToDelete?.name || "Unknown Event"}". This action cannot be
              undone.
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
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
