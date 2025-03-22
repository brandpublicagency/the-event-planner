import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./EventCard";
import { DashboardEventItem } from "./DashboardEventItem";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils";
interface EventMonthGroupProps {
  monthYear: string;
  events: Event[];
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
}
export const EventMonthGroup: React.FC<EventMonthGroupProps> = ({
  monthYear,
  events,
  handleDelete,
  isDashboard = false
}) => {
  if (isDashboard) {
    return <>
        {events.map(event => <DashboardEventItem key={event.event_code} event={event} handleDelete={handleDelete} isDashboard={isDashboard} />)}
      </>;
  }
  return <div className="rounded-xl overflow-hidden bg-white border border-zinc-100 shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b bg-blue-50/50">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600">
          <Calendar className="h-4 w-4 text-blue-600 bg-transparent" />
        </div>
        <h3 className="font-medium text-zinc-800">{monthYear}</h3>
        <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium rounded-full border border-zinc-200 bg-white text-zinc-700 ml-2">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </Badge>
      </div>
      
      <div className="divide-y divide-zinc-100">
        {events.map(event => <EventCard key={event.event_code} event={event} handleDelete={handleDelete} isDashboard={isDashboard} />)}
      </div>
    </div>;
};