
import React from 'react';
import { Notification } from '@/types/notification';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { EmptyNotifications } from '@/components/notifications/EmptyNotifications';
import { motion, AnimatePresence } from 'framer-motion';

export interface NotificationsListProps {
  notifications: Notification[];
  onViewDetail: (id: string, relatedId?: string) => void;
  onCompleteTask: (id: string) => void;
  error?: Error | null;
  listType?: string;
}

export const NotificationsList = ({ 
  notifications,
  onViewDetail,
  onCompleteTask,
  error
}: NotificationsListProps) => {
  if (notifications.length === 0) {
    return <EmptyNotifications />;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-zinc-900">
              Notifications
            </p>
            <p className="text-xs text-muted-foreground">
              {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-50 p-2">
        <AnimatePresence initial={false}>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <NotificationItem
                notification={notification}
                onView={(notification) => onViewDetail(notification.id, notification.relatedId)}
                onComplete={(notification) => onCompleteTask(notification.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="p-3 border-t bg-gray-50">
        <p className="text-xs text-center text-muted-foreground">
          {notifications.filter(n => !n.read).length > 0 
            ? `You have ${notifications.filter(n => !n.read).length} unread notifications` 
            : 'All caught up!'}
        </p>
      </div>
    </div>
  );
};
