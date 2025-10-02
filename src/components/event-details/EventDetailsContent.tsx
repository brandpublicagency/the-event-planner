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
  onEditEvent,
}) => {
  return (
    <div className="flex-1 p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="print-container py-[20px] px-[25px] rounded-md bg-white">
          {event && (
            <EventInfo 
              event={event} 
              formattedDate={formattedDate} 
              formattedTime=""
              onEditEvent={onEditEvent}
            />
          )}
          
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Terms and Conditions:</label>
                  <p className="text-gray-800">Paragraph....</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}