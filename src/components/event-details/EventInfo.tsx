
import React from 'react';
import { format, parseISO } from "date-fns";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { cn } from "@/lib/utils";
import { MenuState } from "@/hooks/menuStateTypes";
import { PrintMenu } from '../menu/PrintMenu';
import PrintKitchenMenu from '../menu/kitchen/PrintKitchenMenu';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EventInfoProps {
  event: Event;
  formattedDate: string;
  formattedTime: string;
  menuState?: MenuState | null;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
}

export const EventInfo = ({
  event,
  formattedDate,
  menuState,
  isCustomMenu = false,
  onCustomMenuToggle
}: EventInfoProps) => {
  // Format the time in 24-hour format (HH:MM)
  const formatTimeDisplay = (timeString: string | null) => {
    if (!timeString) return '';
    return format(parseISO(`2000-01-01T${timeString}`), 'HH:mm');
  };

  const startTime = formatTimeDisplay(event.start_time);
  const endTime = formatTimeDisplay(event.end_time);
  const timeDisplay = startTime && endTime ? `${startTime} - ${endTime}` : '';

  // Get venue names using the utility function
  const venueNames = getVenueNames(event);
  
  // Handler to ensure toggle changes are properly dispatched
  const handleToggleChange = (checked: boolean) => {
    if (onCustomMenuToggle) {
      onCustomMenuToggle(checked);
    }
  };

  return (
    <div className="mb-8 event-info-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <h1 className="tracking-tight px-0 text-zinc-800 text-xl font-bold">
              {event.name} <span className="text-xs font-normal text-zinc-400">{event.event_code}</span>
            </h1>
          </div>
          <div className="text-sm font-bold text-zinc-600">
            {formattedDate}, {timeDisplay} / {event.pax || 0} Guests / {event.event_type} / {venueNames}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          {onCustomMenuToggle && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="custom-menu-toggle" 
                checked={isCustomMenu} 
                onCheckedChange={handleToggleChange}
              />
              <Label htmlFor="custom-menu-toggle">Custom Menu</Label>
            </div>
          )}
          
          {menuState && (
            <div className="flex space-x-2">
              <PrintMenu event={event} menuState={menuState} />
              <PrintKitchenMenu event={event} menuState={menuState} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
