
import React from 'react';
import { Header } from '@/components/layout/Header';
import { useNotificationsPage } from '@/hooks/notifications/useNotificationsPage';
import { NotificationTabs } from '@/components/notifications/NotificationTabs';
import { NotificationActions } from '@/components/notifications/NotificationActions';

const Notifications = () => {
  const {
    activeTab,
    notifications,
    scheduledNotifications,
    loading,
    handleTabChange,
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess
  } = useNotificationsPage();

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Notifications"
        secondaryAction={
          <NotificationActions
            onRefresh={handleRefresh}
            onTriggerProcess={handleTriggerProcess}
            loading={loading}
            showDevActions={process.env.NODE_ENV === 'development'}
          />
        }
      />
      
      <div className="p-6 flex-1">
        <NotificationTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          generalNotifications={notifications}
          scheduledNotifications={scheduledNotifications}
          generalLoading={loading}
          scheduledLoading={loading}
          onViewDetail={handleViewEvent}
          onCompleteTask={handleCompleteTask}
        />
      </div>
    </div>
  );
};

export default Notifications;
