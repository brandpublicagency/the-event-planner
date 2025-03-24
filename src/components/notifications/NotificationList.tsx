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
  return <div className="px-0 py-0 mx-0 my-0 rounded-md bg-[#00000e]/0">
      <div className="bg-transparent">
        <AnimatePresence initial={false}>
          {notifications.map(notification => <motion.div key={notification.id} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.2
        }}>
              <NotificationItem notification={notification} onView={notification => onViewDetail(notification.id, notification.relatedId)} onComplete={notification => onCompleteTask(notification.id)} />
            </motion.div>)}
        </AnimatePresence>
      </div>
    </div>;
};