
import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WeddingMenuPlanner from "@/components/WeddingMenuPlanner";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventInfo } from "@/components/event-details/EventInfo";
import { MenuState } from "@/hooks/menuStateTypes";
import { SaveButton } from "@/components/ui/save-button";
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
  // Handler to log any save button errors
  const handleSaveClick = async () => {
    try {
      console.log("Save button clicked, save function available:", !!saveMenuFunction);
      await onSaveMenu();
    } catch (error) {
      console.error("Error in save button handler:", error);
    }
  };

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
          
          <div className="flex justify-end mt-6 print:hidden">
            <SaveButton 
              onClick={handleSaveClick}
              disabled={!menuState || !saveMenuFunction || isSaving}
              defaultText="Save Menu"
              loadingText="Saving Menu..."
              successText="Menu Saved"
              timeout={30000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
