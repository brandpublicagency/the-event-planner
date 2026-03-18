
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

  const isDropdown = listType === 'dropdown';

  return (
    <div 
      className={isDropdown ? 'space-y-0' : 'space-y-2'}
      onClick={(e) => e.stopPropagation()}
    >
      {notifications.length === 0 ? (
        <div className="p-3 text-center text-sm text-muted-foreground">
          No notifications to display
        </div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onView={onViewDetail} 
            onComplete={onCompleteTask}
            showIcon={!isDropdown}
            isDropdown={isDropdown}
          />
        ))
      )}
    </div>
  );
});

NotificationsList.displayName = 'NotificationsList';
