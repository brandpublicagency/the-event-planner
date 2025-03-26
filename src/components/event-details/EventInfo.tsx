
import React from 'react';
import { format, parseISO } from "date-fns";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { cn } from "@/lib/utils";
import { MenuState } from "@/hooks/menuStateTypes";
import { PrintMenu } from '../menu/print/PrintMenu';
import { Button } from "@/components/ui/button";
import { Edit, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventInfoProps {
  event: Event;
  formattedDate: string;
  formattedTime: string;
  menuState?: MenuState | null;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
  onEditEvent?: () => void;
}

export const EventInfo = ({
  event,
  formattedDate,
  menuState,
  isCustomMenu = false,
  onCustomMenuToggle,
  onEditEvent
}: EventInfoProps) => {
  // Format the time in 24-hour format (HH:MM)
  const formatTimeDisplay = (timeString: string | null) => {
    if (!timeString) return '';
    return format(parseISO(`2000-01-01T${timeString}`), 'HH:mm');
  };
  
  const { toast } = useToast();
  const startTime = formatTimeDisplay(event.start_time);
  const endTime = formatTimeDisplay(event.end_time);
  const timeDisplay = startTime && endTime ? `${startTime} - ${endTime}` : '';

  // Get venue names using the utility function
  const venueNames = getVenueNames(event);

  return (
    <div className="mb-8 event-info-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <h1 className="tracking-normal px-0 text-zinc-700 text-xl font-normal mx-[2px]">
              {event.name} <span className="text-xs font-normal text-zinc-400">{event.event_code}</span>
            </h1>
          </div>
          <div className="text-xs font-normal text-zinc-600 bg-transparent px-0 py-0 mx-[2px] my-[3px]">
            {formattedDate}, {timeDisplay} / {event.pax || 0} Guests / {event.event_type} / {venueNames}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          {onEditEvent && (
            <Button onClick={onEditEvent} variant="outline" size="sm" className="rounded">
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
