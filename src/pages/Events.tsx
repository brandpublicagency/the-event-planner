
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useEvents } from "@/hooks/useEvents";
import { EventsList } from "@/components/events/EventsList";
import { DeleteEventDialog } from "@/components/events/DeleteEventDialog";
import { PassedEventsTab } from "@/components/events/PassedEventsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import type { Event } from "@/types/event";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "passed" ? "passed" : "upcoming";
  const handleTabChange = (value: string) => {
    setSearchParams(value === "passed" ? { tab: "passed" } : {}, { replace: true });
  };
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
    setIsPermanentDelete,
  } = useEvents();
  
  
  // Filter events based on search query
  const filteredEvents = Object.entries(groupedUpcomingEvents).reduce(
    (acc: Record<string, Event[]>, [monthYear, monthEvents]) => {
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
      <Header pageTitle="Events" />

      <div className="flex-1 p-6 bg-muted overflow-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="passed">Passed</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-0">
        <EventsList 
          groupedEvents={filteredEvents} 
          isLoading={isLoading}
          onDelete={handleDeleteEvent} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
          </TabsContent>
          <TabsContent value="passed" className="mt-0">
            <PassedEventsTab />
          </TabsContent>
        </Tabs>
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
