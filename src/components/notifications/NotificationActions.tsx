
import React from "react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/notification";
import { Eye } from "lucide-react";

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
  // Determine if we should show the complete button
  const showCompleteButton = (
    (notification.type === 'task_overdue' || 
     notification.type === 'task_upcoming' ||
     notification.type === 'document_due_reminder' ||
     notification.type === 'final_payment_reminder') &&
    !notification.read
  );
  
  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 p-0"
        onClick={(e) => onView(notification, e)}
      >
        <Eye className="h-3.5 w-3.5 text-zinc-400" />
        <span className="sr-only">View</span>
      </Button>
      
      {showCompleteButton && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 p-0"
          onClick={(e) => onComplete(notification, e)}
        >
          <span className="text-xs text-zinc-400">Complete</span>
        </Button>
      )}
    </div>
  );
};
