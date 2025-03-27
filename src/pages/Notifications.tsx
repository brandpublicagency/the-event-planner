
import React, { useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { useNotifications } from '@/contexts/NotificationContext';
import { ErrorBoundary } from 'react-error-boundary';
import { useToast } from '@/hooks/use-toast';
import { NotificationErrorFallback } from '@/components/notifications/NotificationErrorFallback';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationsList } from '@/components/notifications/NotificationList';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/types/notification';

const Notifications = () => {
  const {
    notifications,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    refreshNotifications,
    loading,
    unreadCount,
    error
  } = useNotifications();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Handle refresh button click
  const handleRefresh = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsRefreshing(true);
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
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [refreshNotifications, toast]);

  // Handle viewing a notification detail
  const handleViewDetail = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log("Page viewing notification:", notification.id, "relatedId:", notification.relatedId);
      await markAsRead(notification.id);
      
      if (notification.relatedId) {
        console.log(`Page navigating to relatedId: ${notification.relatedId}`);
        
        // For event notifications, use consistent format handling
        if (notification.relatedId.match(/^\d+-\d+$/) || 
            notification.relatedId.startsWith('EVENT-') || 
            notification.relatedId.startsWith('event_')) {
          
          // Normalize the event code by removing any prefixes
          let eventCode = notification.relatedId;
          if (notification.relatedId.startsWith('EVENT-')) {
            eventCode = notification.relatedId.replace('EVENT-', '');
          } else if (notification.relatedId.startsWith('event_')) {
            eventCode = notification.relatedId.replace('event_', '');
          }

          console.log(`Page navigating to event: ${eventCode}`);
          
          // Use navigate with location state to avoid the router ignoring same-route clicks
          if (window.location.pathname === `/events/${eventCode}`) {
            // If already on the event page, force a refresh
            window.location.href = `/events/${eventCode}`;
          } else {
            navigate(`/events/${eventCode}`);
          }
        } 
        else if (notification.relatedId.startsWith('task_')) {
          // For task notifications
          navigate(`/tasks?selected=${notification.relatedId}`);
        } 
        else {
          // For other types of notifications
          navigate(`/${notification.relatedId}`);
        }
      } else {
        // If no relatedId, just mark as read but don't navigate
        console.log("No relatedId found in notification");
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
  }, [markAsRead, navigate, toast]);

  // Handle marking all as read
  const handleMarkAllAsRead = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAllAsRead();
      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
    }
  }, [markAllAsRead, toast]);

  // Handle completing a task
  const handleCompleteTask = useCallback(async (notification: Notification, e: React.MouseEvent) => {
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
  }, [markAsCompleted, toast]);

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
          
          <ErrorBoundary 
            FallbackComponent={NotificationErrorFallback} 
            onReset={() => handleRefresh} 
          >
            <div className="mt-4">
              <NotificationsList 
                notifications={notifications}
                onViewDetail={handleViewDetail}
                onCompleteTask={handleCompleteTask}
                error={error}
                listType="all"
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
