
import React from "react";
import { Button } from "@/components/ui/button";
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
        size="sm"
        className="px-3 py-1 h-7 text-xs"
        onClick={(e) => onView(notification, e)}
      >
        View
      </Button>
      
      {showCompleteButton && (
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1 h-7 text-xs border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
          onClick={(e) => onComplete(notification, e)}
        >
          Complete
        </Button>
      )}
    </div>
  );
};
