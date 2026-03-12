
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
      <div className="flex items-center gap-2">
        {onSearchChange && (
          <div className="relative flex-1 max-w-[280px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
        )}

        {alternateLink && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={() => navigate(alternateLink.path)}
          >
            <Calendar className="h-3.5 w-3.5" />
            {alternateLink.label}
          </Button>
        )}

        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={() => navigate('/events/new')}
          >
            <Plus className="h-3.5 w-3.5" />
            New Event
          </Button>
        </div>
      </div>

      <EventsTable
        groupedEvents={groupedEvents}
        isLoading={isLoading}
        onDelete={onDelete}
      />
    </div>
  );
};

export default EventsList;
