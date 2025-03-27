
import React from 'react';
import { Header } from '@/components/layout/Header';
import { useNotifications } from '@/contexts/NotificationContext';
import { ErrorBoundary } from 'react-error-boundary';
import { useToast } from '@/hooks/use-toast';
import { NotificationErrorFallback } from '@/components/notifications/NotificationErrorFallback';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationContent } from '@/components/notifications/NotificationContent';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const {
    notifications,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    loading,
    error
  } = useNotifications();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle refresh button click
  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
  const handleViewDetail = async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAsRead(notification.id);
      
      if (notification.relatedId) {
        // For event notifications, navigate to the events page
        if (notification.relatedId.match(/^\d+-\d+$/) || notification.relatedId.startsWith('EVENT-') || notification.relatedId.startsWith('event_')) {
          // Handle various event ID formats by normalizing them
          const eventCode = notification.relatedId.startsWith('EVENT-') 
            ? notification.relatedId.replace('EVENT-', '') 
            : notification.relatedId.startsWith('event_') 
              ? notification.relatedId.replace('event_', '') 
              : notification.relatedId;

          console.log(`Navigating to event: ${eventCode}`);
          navigate(`/events/${eventCode}`);
        } else if (notification.relatedId.startsWith('task_')) {
          // For task notifications
          navigate(`/tasks?selected=${notification.relatedId}`);
        } else {
          // For other types of notifications
          navigate(`/${notification.relatedId}`);
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
  const handleCompleteTask = async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAsCompleted(notification.id);
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
