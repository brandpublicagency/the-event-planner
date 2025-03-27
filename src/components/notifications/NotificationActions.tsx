
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
  
  return (
    <div className="flex space-x-2">
      {isCompletable && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-6 px-2 text-xs bg-white hover:bg-green-50 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
          onClick={(e) => onComplete(notification, e)}
        >
          <Check className="h-3 w-3 mr-1" />
          <span>Complete</span>
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-6 px-2 text-xs bg-white hover:bg-zinc-50"
        onClick={(e) => onView(notification, e)}
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        <span>View</span>
      </Button>
    </div>
  );
};
