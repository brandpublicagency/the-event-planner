
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Notification } from "@/types/notification";
import { useNavigate } from "react-router-dom";

interface NotificationActionsProps {
  notification: Notification;
  onView: (notification: Notification, e: React.MouseEvent) => void;
  onComplete: (notification: Notification, e: React.MouseEvent) => void;
}

export const NotificationActions: React.FC<NotificationActionsProps> = ({
  notification,
  onView,
  onComplete
}) => {
  const navigate = useNavigate();
  
  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to edit event page if relatedId exists
    if (notification.relatedId) {
      navigate(`/events/${notification.relatedId}/edit`);
    } else {
      // Fall back to original onView handler if no relatedId
      onView(notification, e);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs h-7 px-2 border-zinc-200 flex items-center gap-1"
        onClick={handleViewClick}
      >
        View
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs h-7 px-2 flex items-center gap-1 text-black border border-green-500 hover:bg-green-500 hover:text-white transition-colors"
        onClick={(e) => onComplete(notification, e)}
      >
        <Check className="h-3 w-3" />
        Mark as done
      </Button>
    </div>
  );
};
