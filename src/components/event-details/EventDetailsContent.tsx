
import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WeddingMenuPlanner from "@/components/menu-planner/WeddingMenuPlanner";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventInfo } from "@/components/event-details/EventInfo";
import { MenuState } from "@/hooks/menuStateTypes";
import { Edit } from "lucide-react";
import { toast } from "sonner";

interface EventDetailsContentProps {
  event: Event;
  eventId: string;
  formattedDate: string;
  isCustomMenu: boolean;
  menuState: MenuState | null;
  saveMenuFunction: (() => Promise<void>) | null;
  isSaving: boolean;
  onEditEvent: () => void;
  onCustomMenuToggle: (checked: boolean) => void;
  onMenuStateChange: (menuState: MenuState) => void;
  onSaveMenuSelections: (saveFn: () => Promise<void>) => void;
  onSaveMenu: () => Promise<void>;
}

export const EventDetailsContent: React.FC<EventDetailsContentProps> = ({
  event,
  eventId,
  formattedDate,
  isCustomMenu,
  menuState,
  saveMenuFunction,
  isSaving,
  onEditEvent,
  onCustomMenuToggle,
  onMenuStateChange,
  onSaveMenuSelections,
  onSaveMenu,
}) => {
  // Debug monitor for save functionality
  React.useEffect(() => {
    console.log('EventDetailsContent ready with save state:', {
      hasSaveFunction: !!saveMenuFunction,
      isSaving,
      menuStateInitialized: !!menuState
    });
  }, [saveMenuFunction, isSaving, menuState]);

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="print:hidden mb-6">
          {event && menuState && (
            <EventHeader 
              eventCode={event.event_code} 
              event={event}
              menuState={menuState}
              isCustomMenu={isCustomMenu} 
              onCustomMenuToggle={onCustomMenuToggle} 
            />
          )}
        </div>
        
        <div className="print-container py-[20px] px-[25px] rounded-md bg-white">
          {event && <EventInfo event={event} formattedDate={formattedDate} formattedTime="" />}
          
          {eventId && (
            <WeddingMenuPlanner 
              eventCode={eventId} 
              eventName={event?.name} 
              isCustomMenu={isCustomMenu} 
              onCustomMenuToggle={onCustomMenuToggle}
              onMenuStateChange={onMenuStateChange}
              saveMenuSelections={onSaveMenuSelections}
            />
          )}
          
          {/* Save button removed from here to prevent duplication */}
        </div>
      </div>
    </div>
  );
};
