
import React from "react";
import { Notification } from "@/types/notification";
import { NotificationItem } from "./NotificationItem";
import { EmptyNotifications } from "./EmptyNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";
interface NotificationListProps {
  notifications: Notification[];
  onViewDetail?: (id: string, relatedId?: string) => void;
  onCompleteTask?: (id: string) => void;
  listType?: string;
  error?: Error | null;
}
export const NotificationsList: React.FC<NotificationListProps> = ({
  notifications,
  onViewDetail,
  onCompleteTask,
  error
}) => {
  if (notifications.length === 0) {
    return <EmptyNotifications />;
  }
  const handleView = (notification: Notification, e: React.MouseEvent) => {
    if (onViewDetail) {
      onViewDetail(notification.id, notification.relatedId);
    }
  };
  const handleComplete = (notification: Notification, e: React.MouseEvent) => {
    if (onCompleteTask) {
      onCompleteTask(notification.id);
    }
  };
  return <div className="p-2 px-0 py-[10px]">
      {notifications.map(notification => <NotificationItem key={notification.id} notification={notification} onView={handleView} onComplete={handleComplete} />)}
    </div>;
};
