
import React from "react";
import { NotificationsList } from "@/components/notifications/NotificationList";
import { useDashboardNotifications } from "./notifications/useDashboardNotifications";
import { NotificationError } from "./notifications/NotificationError";
import { NotificationLoading } from "./notifications/NotificationLoading";
import { NotificationEmpty } from "./notifications/NotificationEmpty";
import { NotificationHeader } from "./notifications/NotificationHeader";
import { NotificationFooter } from "./notifications/NotificationFooter";
import { DashboardNotificationsContent } from "./notifications/DashboardNotificationsContent";

const DashboardNotificationsSection = () => {
  const {
    notifications,
    limitedNotifications,
    unreadCount,
    loading,
    isRefreshing,
    error,
    handleRefresh,
    handleNotificationView,
    handleNotificationComplete,
    handleMarkAllAsRead,
    handleViewAllNotifications,
  } = useDashboardNotifications();

  if (error) {
    return <NotificationError onRefresh={handleRefresh} />;
  }

  return (
    <div className="flex flex-col">
      <NotificationHeader
        unreadCount={unreadCount}
        loading={loading}
        isRefreshing={isRefreshing}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRefresh={handleRefresh}
      />

      {(loading && notifications.length === 0) || isRefreshing ? (
        <NotificationLoading />
      ) : limitedNotifications.length > 0 ? (
        <DashboardNotificationsContent 
          notifications={limitedNotifications} 
          onViewDetail={handleNotificationView} 
          onCompleteTask={handleNotificationComplete} 
        />
      ) : (
        <NotificationEmpty loading={loading} onRefresh={handleRefresh} />
      )}

      <NotificationFooter 
        hasMoreNotifications={notifications.length > 3} 
        onViewAllNotifications={handleViewAllNotifications} 
      />
    </div>
  );
};

export default DashboardNotificationsSection;
