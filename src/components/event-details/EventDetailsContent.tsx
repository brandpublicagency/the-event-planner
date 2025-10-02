import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventInfo } from "@/components/event-details/EventInfo";
import { EventOverviewSection } from "@/components/event-overview/EventOverviewSection";
import { Edit, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EventOverview } from "@/types/eventOverview";
import { useReactToPrint } from "react-to-print";
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
  const [localEvent, setLocalEvent] = useState(event);
  const printRef = useRef<HTMLDivElement>(null);

  // Sync local state with prop changes
  React.useEffect(() => {
    setLocalEvent(event);
  }, [event]);

  const handleOverviewUpdate = (overview: EventOverview) => {
    setLocalEvent(prev => ({ ...prev, overview }));
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${localEvent.name || 'Event'} - Details`,
  });

  const onPrintClick = () => {
    handlePrint();
  };

  return <div className="flex-1 p-6 bg-gray-100">
      <div className="w-full">
        <div ref={printRef} className="print-container py-[20px] px-[25px] rounded-md bg-white">
          {localEvent && <EventInfo event={localEvent} formattedDate={formattedDate} formattedTime="" onEditEvent={onEditEvent} />}
          
          {localEvent && eventId && (
            <EventOverviewSection 
              eventCode={eventId}
              overview={localEvent.overview}
              onUpdate={handleOverviewUpdate}
            />
          )}
          
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-foreground/70">Terms and Conditions</h3>
            <p className="text-sm text-foreground">{localEvent.event_notes || "No terms and conditions provided"}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onPrintClick}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
    </div>;
};