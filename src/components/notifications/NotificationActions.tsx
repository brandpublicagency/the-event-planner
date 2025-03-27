
import React from 'react';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Check, ExternalLink } from 'lucide-react';

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
  // Determine if this is a task-type notification that can be completed
  const isCompletable = notification.actionType === 'complete';
  
  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation
    console.log("NotificationAction view clicked for:", notification.id, "relatedId:", notification.relatedId);
    onView(notification, e);
  };
  
  const handleCompleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation
    console.log("NotificationAction complete clicked for:", notification.id);
    onComplete(notification, e);
  };
  
  return (
    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
      {isCompletable && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 px-2 text-xs bg-white hover:bg-green-50 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
          onClick={handleCompleteClick}
        >
          <Check className="h-3 w-3 mr-1" />
          <span>Complete</span>
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 px-2 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
        onClick={handleViewClick}
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        <span>View</span>
      </Button>
    </div>
  );
};
