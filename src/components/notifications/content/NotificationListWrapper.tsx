
import React from 'react';
import { NotificationsList } from "@/components/notifications/NotificationList";
import { Notification } from '@/types/notification';

interface NotificationListWrapperProps {
  notifications: Notification[];
  onViewDetail: (notification: Notification, e: React.MouseEvent) => void;
  onCompleteTask: (notification: Notification, e: React.MouseEvent) => void;
}

export const NotificationListWrapper = ({ 
  notifications, 
  onViewDetail, 
  onCompleteTask 
}: NotificationListWrapperProps) => {
  
  const handleViewDetail = (notification: Notification, e: React.MouseEvent) => {
    console.log("NotificationListWrapper handleViewDetail called for:", notification.id);
    onViewDetail(notification, e);
  };

  const handleCompleteTask = (notification: Notification, e: React.MouseEvent) => {
    console.log("NotificationListWrapper handleCompleteTask called for:", notification.id);
    onCompleteTask(notification, e);
  };

  return (
    <NotificationsList
      notifications={notifications}
      onViewDetail={handleViewDetail}
      onCompleteTask={handleCompleteTask}
      listType="dropdown"
    />
  );
};
