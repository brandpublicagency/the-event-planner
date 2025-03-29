
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
    // Prevent default behavior and stop propagation to prevent parent clicks
    e.preventDefault(); 
    e.stopPropagation();
    
    console.log("NotificationAction view clicked for:", notification.id, "relatedId:", notification.relatedId);
    
    // Call the parent component's view handler
    onView(notification, e);
  };
  
  const handleCompleteClick = (e: React.MouseEvent) => {
    // Prevent default behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    console.log("NotificationAction complete clicked for:", notification.id);
    
    // Call the parent component's complete handler
    onComplete(notification, e);
  };
  
  return (
    <div 
      className="flex space-x-2" 
      onClick={(e) => e.stopPropagation()}
    >
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
        className="h-7 px-2 text-xs font-medium bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border-gray-800 hover:border-gray-900"
        onClick={handleViewClick}
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        <span>View</span>
      </Button>
    </div>
  );
};
