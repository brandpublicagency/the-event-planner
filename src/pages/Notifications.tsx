
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
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
    <div className="container py-6 max-w-5xl">
      <PageHeader
        pageTitle="Notifications"
        actionButton={
          activeTab === 'general' && notifications.some(n => !n.read) 
            ? {
                label: "Mark All Read",
                onClick: handleMarkAllRead,
              }
            : undefined
        }
        secondaryAction={
          <NotificationActions
            onRefresh={handleRefresh}
            onTriggerProcess={handleTriggerProcess}
            loading={loading}
            showDevActions={process.env.NODE_ENV === 'development'}
          />
        }
      />

      <NotificationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        generalNotifications={notifications}
        scheduledNotifications={scheduledNotifications}
        generalLoading={false}
        scheduledLoading={loading}
        onViewDetail={handleViewEvent}
        onCompleteTask={handleCompleteTask}
      />
    </div>
  );
};

export default Notifications;
