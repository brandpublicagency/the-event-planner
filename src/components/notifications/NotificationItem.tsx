
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
  // Format relative time (e.g., "2 hours ago")
  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true
  });
  
  // Handle click on the notification item itself
  const handleClick = (e: React.MouseEvent) => {
    // Always prevent default and stop propagation to avoid bubbling
    e.preventDefault();
    e.stopPropagation();
    console.log("NotificationItem clicked:", notification.id, "relatedId:", notification.relatedId);
    
    // Call the view handler to navigate to the related content
    onView(notification, e);
  };
  
  return (
    <div 
      className={`rounded-md transition-all duration-200 hover:bg-gray-50 ${notification.read && !isDropdown ? 'opacity-60' : 'opacity-100'} ${isDropdown ? 'p-3 cursor-pointer' : ''}`} 
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
