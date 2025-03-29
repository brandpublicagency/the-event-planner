
import React from 'react';
import { Header } from '@/components/layout/Header';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { NotificationListContainer } from '@/components/notifications/NotificationListContainer';
import { useNotificationPage } from '@/hooks/useNotificationPage';

const Notifications = () => {
  const {
    notifications,
    filteredNotifications,
    loading,
    isRefreshing,
    unreadCount,
    error,
    currentFilter,
    handleRefresh,
    handleViewDetail,
    handleMarkAllAsRead,
    handleCompleteTask,
    handleFilterChange
  } = useNotificationPage();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header pageTitle="Notifications" />
      
      <div className="container py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <NotificationHeader 
            unreadCount={unreadCount}
            onMarkAllAsRead={handleMarkAllAsRead} 
            onRefresh={handleRefresh} 
            loading={loading} 
            isRefreshing={isRefreshing} 
          />
          
          <NotificationFilters
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            counts={{
              all: notifications.length,
              unread: unreadCount,
              read: notifications.length - unreadCount
            }}
          />
          
          <NotificationListContainer 
            notifications={filteredNotifications}
            onViewDetail={handleViewDetail}
            onCompleteTask={handleCompleteTask}
            onRefresh={handleRefresh}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
