
import React, { memo } from 'react';
import { Notification } from '@/types/notification';
import { NotificationActions } from './NotificationActions';
import { formatDistanceToNow } from 'date-fns';
interface NotificationItemProps {
  notification: Notification;
  onView: (notification: Notification, e: React.MouseEvent) => void;
  onComplete: (notification: Notification, e: React.MouseEvent) => void;
}

// Memoize the component to prevent unnecessary re-renders
export const NotificationItem = memo(({
  notification,
  onView,
  onComplete
}: NotificationItemProps) => {
  // Format relative time (e.g., "2 hours ago")
  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true
  });
  
  return (
    <div className="rounded-md bg-white">
      <div className="px-[10px] py-[10px] bg-white mx-0 my-0">
        <div className="flex flex-col mb-1">
          <h4 className={`text-sm font-medium ${!notification.read ? 'text-zinc-900' : 'text-zinc-600'}`}>
            {notification.title}
          </h4>
          <p className={`text-xs ${!notification.read ? 'text-zinc-700' : 'text-zinc-500'} line-clamp-2`}>
            {notification.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">{formattedTime}</span>
          <NotificationActions notification={notification} onView={onView} onComplete={onComplete} />
        </div>
      </div>
    </div>
  );
});

// Add display name for React DevTools
NotificationItem.displayName = 'NotificationItem';
