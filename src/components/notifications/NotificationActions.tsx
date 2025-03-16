
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Notification } from "@/types/notification";

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
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs h-7 px-2 border-zinc-200 flex items-center gap-1"
        onClick={(e) => onView(notification, e)}
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
