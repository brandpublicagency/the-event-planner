
import React from "react";
import { Notification } from "@/types/notification";
import { NotificationItem } from "./NotificationItem";
import { EmptyNotifications } from "./EmptyNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationListProps {
  notifications: Notification[];
  onView: (notification: Notification, e: React.MouseEvent) => void;
  onComplete: (notification: Notification, e: React.MouseEvent) => void;
}

export const NotificationsList: React.FC<NotificationListProps> = ({
  notifications,
  onView,
  onComplete
}) => {
  if (notifications.length === 0) {
    return <EmptyNotifications />;
  }
  
  return (
    <div className="divide-y divide-zinc-100">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onView={onView}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
};
