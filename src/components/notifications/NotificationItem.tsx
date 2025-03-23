
import React, { memo } from 'react';
import { Notification } from '@/types/notification';
import { NotificationActions } from './NotificationActions';
import { Calendar, Bell, CheckSquare, FileText, Clock } from 'lucide-react';
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
  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
  
  // Get the appropriate icon based on notification type
  const getIcon = () => {
    const iconProps = { className: 'h-4 w-4 flex-shrink-0' };
    
    if (notification.type.includes('event')) {
      return <Calendar {...iconProps} className={`${iconProps.className} text-primary-500`} />;
    } else if (notification.type.includes('task')) {
      return <CheckSquare {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    } else if (notification.type.includes('document')) {
      return <FileText {...iconProps} className={`${iconProps.className} text-orange-500`} />;
    } else if (notification.type.includes('payment')) {
      return <Clock {...iconProps} className={`${iconProps.className} text-green-500`} />;
    }
    
    return <Bell {...iconProps} className={`${iconProps.className} text-zinc-500`} />;
  };
  
  return (
    <div 
      className={`flex gap-3 p-3 hover:bg-zinc-50 transition-colors ${
        !notification.read ? 'bg-gray-50' : ''
      }`}
    >
      <div className={`rounded-full p-1.5 flex items-center justify-center mt-0.5 bg-zinc-100`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
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
          <NotificationActions 
            notification={notification}
            onView={onView}
            onComplete={onComplete}
          />
        </div>
      </div>
    </div>
  );
});

// Add display name for React DevTools
NotificationItem.displayName = 'NotificationItem';
