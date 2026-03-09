
import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventsTable from "@/components/events/EventsTable";
import type { Event } from "@/types/event";

interface EventsListProps {
  groupedEvents: Record<string, Event[]>;
  isLoading?: boolean;
  onDelete?: (event: Event) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  alternateLink?: {
    path: string;
    label: string;
  };
}

export const EventsList: React.FC<EventsListProps> = ({
  groupedEvents,
  isLoading = false,
  onDelete,
  searchQuery = "",
  onSearchChange,
  alternateLink
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex w-full sm:w-auto gap-2 items-center">
          {onSearchChange &&
          <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 w-full sm:w-[250px] text-sm" />
            
            </div>
          }
          
          {alternateLink &&
          <Button
            variant="outline"
            size="sm"
            className="h-9 shadow-none border-solid border text-xs font-mono rounded-md font-light text-foreground bg-background border-border"
            onClick={() => navigate(alternateLink.path)}>
            
              <Calendar className="h-4 w-4 mr-1.5" />
              {alternateLink.label}
            </Button>
          }
        </div>
        
        <Button
          onClick={() => navigate('/events/new')}
          size="sm"
          className="h-9">
          
          <Plus className="h-4 w-4 mr-1.5" />
          New Event
        </Button>
      </div>
      
      <EventsTable
        groupedEvents={groupedEvents}
        isLoading={isLoading}
        onDelete={onDelete} />
      
    </div>);

};

export default EventsList;