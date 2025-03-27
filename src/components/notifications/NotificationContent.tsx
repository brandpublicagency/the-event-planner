
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationsList } from "@/components/notifications/NotificationList";
import { Notification } from '@/types/notification';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
  // Take only the first 5 notifications for dropdowns
  const limitedNotifications = notifications.slice(0, 5);
  
  const handleViewDetail = (notification: Notification, e: React.MouseEvent) => {
    console.log("NotificationContent handleViewDetail called for:", notification.id);
    onViewDetail(notification, e);
  };

  return (
    <ScrollArea className="h-[350px] w-full px-3 pt-2">
      {(loading && notifications.length === 0) || isRefreshing ? (
        <div className="p-2 space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-2 p-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-3 text-center">
          <p className="text-sm text-red-500 mb-2">Failed to load notifications</p>
          <Button 
            variant="default" 
            size="sm"
            onClick={onRefresh}
            className="inline-flex items-center gap-1"
          >
            <span>Try again</span>
          </Button>
        </div>
      ) : limitedNotifications.length > 0 ? (
        <NotificationsList
          notifications={limitedNotifications}
          onViewDetail={handleViewDetail}
          onCompleteTask={onCompleteTask}
          listType="dropdown"
        />
      ) : (
        <div className="p-3 text-center">
          <p className="text-sm text-zinc-500">No notifications to display</p>
          <Button
            variant="default"
            size="sm"
            onClick={onRefresh}
            className="mt-2"
          >
            Refresh
          </Button>
        </div>
      )}
    </ScrollArea>
  );
};
