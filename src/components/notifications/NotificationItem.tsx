
import React, { memo } from 'react';
import { Notification } from '@/types/notification';
import { NotificationActions } from './NotificationActions';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onView: (notification: Notification, e: React.MouseEvent) => void;
  onComplete: (notification: Notification, e: React.MouseEvent) => void;
  showIcon?: boolean;
  isDropdown?: boolean;
}

// Memoize the component to prevent unnecessary re-renders
export const NotificationItem = memo(({
  notification,
  onView,
  onComplete,
  showIcon = true,
  isDropdown = false
}: NotificationItemProps) => {
  // Format relative time with "Just now" for very recent
  const getFormattedTime = () => {
    const now = Date.now();
    const notificationTime = new Date(notification.createdAt).getTime();
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    return formatDistanceToNow(new Date(notification.createdAt), {
      addSuffix: true
    });
  };
  
  const formattedTime = getFormattedTime();
  
  // Handle click on the notification item itself
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onView(notification, e);
  };
  
  return (
    <div 
      className={`rounded-md transition-all duration-300 hover:bg-gray-50 ${
        notification.read ? 'opacity-60' : 'opacity-100 animate-in fade-in slide-in-from-top-2'
      } ${isDropdown ? 'p-3 cursor-pointer' : ''}`}
    >
      <div 
        className={`${isDropdown ? 'mx-0 my-0 border-b border-gray-100 pb-3 last:border-0 last:pb-0' : 'px-3 py-2.5 mx-0 rounded-md my-[10px] bg-white border border-gray-100 hover:border-gray-200 transition-colors shadow-sm'}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Notification: ${notification.title}`}
      >
        <div className="flex flex-col mb-1">
          <h4 
            className={`text-gray-800 font-medium text-sm ${isDropdown ? 'cursor-pointer' : ''}`}
          >
            {notification.title}
          </h4>
          <p className={`text-xs ${!notification.read ? 'text-gray-700' : 'text-gray-500'} line-clamp-2`}>
            {notification.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{formattedTime}</span>
          {!isDropdown && <NotificationActions notification={notification} onView={onView} onComplete={onComplete} />}
        </div>
      </div>
    </div>
  );
});

// Add display name for React DevTools
NotificationItem.displayName = 'NotificationItem';
