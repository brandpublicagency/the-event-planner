
import React from "react";
import { Notification } from "@/types/notification";
import { Eye, CheckSquare } from "lucide-react";
import { FileActionButton } from "@/components/tasks/file-actions/FileActionButton";

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
    <div className="flex space-x-1">
      <FileActionButton
        icon={Eye}
        onClick={(e) => onView(notification, e)}
        className="h-6 w-6"
      />
      
      {showCompleteButton && (
        <FileActionButton
          icon={CheckSquare}
          onClick={(e) => onComplete(notification, e)}
          className="h-6 w-6"
        />
      )}
    </div>
  );
};
