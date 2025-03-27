
import React, { memo } from 'react';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NotificationsListProps {
  notifications: Notification[];
  onViewDetail: (notification: Notification, e: React.MouseEvent) => void;
  onCompleteTask: (notification: Notification, e: React.MouseEvent) => void;
  error?: Error | null;
  listType?: 'all' | 'dropdown' | 'dashboard';
}

export const NotificationsList = memo(({
  notifications,
  onViewDetail,
  onCompleteTask,
  error,
  listType = 'all'
}: NotificationsListProps) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          There was an error loading notifications
        </AlertDescription>
      </Alert>
    );
  }

  const handleView = (notification: Notification, e: React.MouseEvent) => {
    console.log("NotificationsList handleView called for:", notification.id, "relatedId:", notification.relatedId);
    
    // Ensure event doesn't propagate up
    e.preventDefault();
    e.stopPropagation();
    
    // Pass the event to the parent handler
    onViewDetail(notification, e);
  };

  const handleComplete = (notification: Notification, e: React.MouseEvent) => {
    console.log("NotificationsList handleComplete called for:", notification.id);
    
    // Ensure event doesn't propagate up
    e.preventDefault();
    e.stopPropagation();
    
    // Pass the event to the parent handler
    onCompleteTask(notification, e);
  };

  const isDropdown = listType === 'dropdown';

  return (
    <div 
      className={`${isDropdown ? 'space-y-0' : 'space-y-2'}`}
      onClick={(e) => e.stopPropagation()} // Prevent click propagation at the container level
    >
      {notifications.length === 0 ? (
        <div className="p-3 text-center text-sm text-zinc-500">
          No notifications to display
        </div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onView={handleView} 
            onComplete={handleComplete}
            showIcon={!isDropdown}
            isDropdown={isDropdown}
          />
        ))
      )}
    </div>
  );
});

NotificationsList.displayName = 'NotificationsList';
