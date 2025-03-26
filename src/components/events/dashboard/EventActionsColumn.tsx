
import React from "react";
import { EventActionButtons } from "./EventActionButtons";

interface EventActionsColumnProps {
  eventCode: string;
  eventName: string;
  handleDelete?: (eventCode: string, isPermanent?: boolean) => Promise<void>;
}

export const EventActionsColumn: React.FC<EventActionsColumnProps> = ({ 
  eventCode, 
  eventName, 
  handleDelete 
}) => {
  return (
    <EventActionButtons
      eventCode={eventCode}
      eventName={eventName}
      handleDelete={handleDelete}
    />
  );
};
