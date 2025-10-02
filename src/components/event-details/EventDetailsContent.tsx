import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventInfo } from "@/components/event-details/EventInfo";
import { Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
export interface EventDetailsContentProps {
  event: Event;
  eventId: string;
  formattedDate: string;
  onEditEvent: () => void;
}
export const EventDetailsContent: React.FC<EventDetailsContentProps> = ({
  event,
  eventId,
  formattedDate,
  onEditEvent
}) => {
  return <div className="flex-1 p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="print-container py-[20px] px-[25px] rounded-md bg-white">
          {event && <EventInfo event={event} formattedDate={formattedDate} formattedTime="" onEditEvent={onEditEvent} />}
          
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-foreground/70">Terms and Conditions</h3>
            <p className="text-sm text-foreground">{event.event_notes || "No terms and conditions provided"}</p>
          </div>
        </div>
      </div>
    </div>;
};