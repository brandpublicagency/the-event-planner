
import React from 'react';
import { NotificationsList } from "@/components/notifications/NotificationList";

interface DashboardNotificationsContentProps {
  notifications: any[];
  onViewDetail: (notification: any, e: React.MouseEvent) => void;
  onCompleteTask: (notification: any, e: React.MouseEvent) => void;
}

export const DashboardNotificationsContent = ({
  notifications,
  onViewDetail,
  onCompleteTask
}: DashboardNotificationsContentProps) => {
  return (
    <div className="h-auto mx-0 px-0 py-0 my-2 rounded bg-[#000a0e]/0">
      <NotificationsList 
        notifications={notifications} 
        onViewDetail={onViewDetail} 
        onCompleteTask={onCompleteTask} 
        listType="dashboard"
      />
    </div>
  );
};
