
import React, { useEffect } from 'react';
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

  // Log notifications for debugging
  console.log('Current notifications:', notifications);
  console.log('Scheduled notifications:', scheduledNotifications);
  
  // Auto-trigger processing on initial load to ensure we have the latest notifications
  useEffect(() => {
    // Only trigger if there are no scheduled notifications
    if (scheduledNotifications.length === 0 && !loading) {
      console.log('No scheduled notifications found, triggering processing...');
      handleTriggerProcess();
    }
  }, [scheduledNotifications.length, loading, handleTriggerProcess]);

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Notifications"
        secondaryAction={
          <NotificationActions
            onRefresh={handleRefresh}
            onTriggerProcess={handleTriggerProcess}
            loading={loading}
            showDevActions={process.env.NODE_ENV === 'development' || true} // Always show for now
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
