
import React from "react";
import { Eye, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";

interface EventCardActionsProps {
  event: Event;
  isDashboard?: boolean;
  onEdit?: (eventCode: string) => void;
  onView?: (eventCode: string) => void;
  onDelete?: (event: Event) => void;
}

export const EventCardActions: React.FC<EventCardActionsProps> = ({
  event,
  isDashboard = false,
  onEdit,
  onView,
  onDelete,
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(event.event_code);
  };
  
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) onView(event.event_code);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(event);
  };

  if (isDashboard) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 p-0"
        onClick={handleViewClick}
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="sr-only">View event</span>
      </Button>
    );
  }

  return (
    <>
      {onEdit && (
        <Button
          onClick={handleEditClick}
          variant="ghost"
          size="icon"
          className="h-7 w-7 p-0"
        >
          <Edit className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="sr-only">Edit</span>
        </Button>
      )}
      
      {onView && (
        <Button
          onClick={handleViewClick}
          variant="ghost"
          size="icon"
          className="h-7 w-7 p-0"
        >
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="sr-only">View</span>
        </Button>
      )}
      
      {onDelete && (
        <Button
          onClick={handleDeleteClick}
          variant="ghost"
          size="icon"
          className="h-7 w-7 p-0"
        >
          <Trash className="h-3.5 w-3.5 text-zinc-400" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
    </>
  );
};
