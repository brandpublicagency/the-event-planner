
import React from 'react';
import { Notification } from '@/types/notification';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { EmptyNotifications } from '@/components/notifications/EmptyNotifications';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationFooter } from '@/components/notifications/NotificationFooter';

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
      
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onViewDetail={onViewDetail}
            onCompleteTask={onCompleteTask}
          />
        ))}
      </div>
      
      <NotificationFooter count={notifications.length} />
    </div>
  );
};
