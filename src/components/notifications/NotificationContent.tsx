
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from '@/types/notification';
import { NotificationLoadingState } from './content/NotificationLoadingState';
import { NotificationErrorState } from './content/NotificationErrorState';
import { NotificationEmptyState } from './content/NotificationEmptyState';
import { NotificationsList } from './NotificationList';

const MAX_DROPDOWN_NOTIFICATIONS = 5;

interface NotificationContentProps {
  notifications: Notification[];
  loading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  onViewDetail: (notification: Notification, e: React.MouseEvent) => void;
  onCompleteTask: (notification: Notification, e: React.MouseEvent) => void;
  onRefresh: (e: React.MouseEvent) => void;
}

export const NotificationContent = ({
  notifications,
  loading,
  isRefreshing,
  error,
  onViewDetail,
  onCompleteTask,
  onRefresh
}: NotificationContentProps) => {
  const limitedNotifications = notifications.slice(0, MAX_DROPDOWN_NOTIFICATIONS);
  
  return (
    <ScrollArea className="h-[350px] w-full px-3 pt-2">
      {(loading && notifications.length === 0) || isRefreshing ? (
        <NotificationLoadingState />
      ) : error ? (
        <NotificationErrorState onRefresh={onRefresh} />
      ) : limitedNotifications.length > 0 ? (
        <NotificationsList
          notifications={limitedNotifications}
          onViewDetail={onViewDetail}
          onCompleteTask={onCompleteTask}
          listType="dropdown"
        />
      ) : (
        <NotificationEmptyState onRefresh={onRefresh} />
      )}
    </ScrollArea>
  );
};
