
import React from 'react';
import { Header } from '@/components/layout/Header';
import { useNotifications } from '@/contexts/NotificationContext';
import { ErrorBoundary } from 'react-error-boundary';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationErrorFallback } from '@/components/notifications/NotificationErrorFallback';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationContent } from '@/components/notifications/NotificationContent';

const Notifications = () => {
  const {
    notifications,
    markAsRead,
    markAsCompleted,
    refreshNotifications
  } = useNotifications();
  
  const { loading, error } = useNotificationStore();
  const { toast } = useToast();

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      await refreshNotifications();
      toast({
        title: 'Success',
        description: 'Notifications refreshed successfully',
      });
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh notifications',
        variant: 'destructive',
      });
    }
  };

  // Handle viewing a notification detail
  const handleViewDetail = async (id: string, relatedId?: string) => {
    try {
      await markAsRead(id);
      
      // Navigate based on notification type
      if (relatedId) {
        if (relatedId.startsWith('event_')) {
          window.location.href = `/events/${relatedId}`;
        } else {
          window.location.href = `/${relatedId}`;
        }
      }
      
      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Handle completing a task
  const handleCompleteTask = async (id: string) => {
    try {
      await markAsCompleted(id);
      toast({
        title: "Task marked as complete",
      });
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark task as complete",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header pageTitle="Notifications" />
      
      <div className="container py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <NotificationHeader 
            onRefresh={handleRefresh} 
            loading={loading} 
          />
          
          <ErrorBoundary 
            FallbackComponent={NotificationErrorFallback} 
            onReset={handleRefresh}
          >
            <div className="mt-4">
              <NotificationContent 
                notifications={notifications}
                loading={loading}
                error={error}
                onViewDetail={handleViewDetail}
                onCompleteTask={handleCompleteTask}
                onRefresh={handleRefresh}
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
