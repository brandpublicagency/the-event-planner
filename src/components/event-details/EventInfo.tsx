
import React from 'react';
import { format, parseISO } from "date-fns";
import type { Event } from "@/types/event";
import { getVenueNames } from "@/utils/venueUtils";
import { cn } from "@/lib/utils";
import { MenuState } from "@/hooks/menuStateTypes";
import { PrintMenu } from '../menu/PrintMenu';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const { toast } = useToast();

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

  const handlePrint = () => {
    if (!menuState) {
      toast({
        title: "Cannot print menu",
        description: "Menu information is not available",
        variant: "destructive"
      });
      return;
    }
    
    // Open print dialog
    window.print();
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
            <Button 
              onClick={handlePrint}
              className="rounded-full" 
              variant="outline"
              size="sm"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Menu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
