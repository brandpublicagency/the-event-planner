
import React from 'react';
import { Notification } from '@/types/notification';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { EmptyNotifications } from '@/components/notifications/EmptyNotifications';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationFooter } from '@/components/notifications/NotificationFooter';
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
  error,
  listType = 'default'
}: NotificationsListProps) => {
  if (notifications.length === 0) {
    return <EmptyNotifications />;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <NotificationHeader 
        count={notifications.length} 
        listType={listType}
      />
      
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
      
      <NotificationFooter 
        unreadCount={notifications.filter(n => !n.read).length}
        onViewAll={() => window.location.href = '/notifications'}
      />
    </div>
  );
};
