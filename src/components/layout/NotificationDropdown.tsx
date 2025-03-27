import React, { useCallback, useEffect, useState } from 'react';
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Notification } from "@/types/notification";
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationContent } from '@/components/notifications/NotificationContent';
import { NotificationFooter } from '@/components/notifications/NotificationFooter';

export function NotificationDropdown() {
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dropdownInitialized, setDropdownInitialized] = useState(false);

  useEffect(() => {
    if (!dropdownInitialized) {
      setDropdownInitialized(true);
      console.log("Initializing notification dropdown");
      refreshNotifications().catch(err => {
        console.error("Error refreshing notifications in dropdown:", err);
      });
    }
  }, [refreshNotifications, dropdownInitialized]);

  const handleRefresh = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsRefreshing(true);
    refreshNotifications()
      .catch(err => {
        console.error("Error refreshing notifications:", err);
      })
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
  }, [refreshNotifications]);

  const handleViewNotification = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log("Dropdown viewing notification:", notification.id, "relatedId:", notification.relatedId);
      await markAsRead(notification.id);
      
      if (notification.relatedId) {
        console.log(`Dropdown navigating to related ID: ${notification.relatedId}`);
        
        // For event notifications, pass the ID exactly as stored in the relatedId
        if (notification.relatedId.match(/^\d+-\d+$/) || 
            notification.relatedId.startsWith('EVENT-') || 
            notification.relatedId.startsWith('event_') ||
            notification.relatedId.match(/^[A-Z]+-\d+-\d+$/)) {  // Added pattern for COR-2503-780
          
          // Use the event code exactly as is
          const eventCode = notification.relatedId;
          console.log(`Notification dropdown: navigating to event: ${eventCode}`);
          
          // For same route navigation, force a page reload
          if (window.location.pathname === `/events/${eventCode}`) {
            console.log(`Already on event page ${eventCode}, forcing reload`);
            window.location.href = `/events/${eventCode}`;
          } else {
            // For different route, use navigate
            console.log(`Navigating to event page ${eventCode}`);
            navigate(`/events/${eventCode}`);
          }
        } 
        else if (notification.relatedId.startsWith('task_')) {
          console.log(`Navigating to task: ${notification.relatedId}`);
          navigate(`/tasks?selected=${notification.relatedId}`);
        } 
        else {
          // For any other type of notification
          console.log(`Navigating to general path: ${notification.relatedId}`);
          navigate(`/${notification.relatedId}`);
        }
      } else {
        console.log("No relatedId found in notification, navigating to notifications page");
        navigate('/notifications');
      }
      
      toast({
        title: "Notification marked as read"
      });
    } catch (error) {
      console.error("Error handling notification click:", error);
      toast({
        title: "Failed to process notification",
        variant: "destructive"
      });
    }
  }, [markAsRead, navigate, toast]);

  const handleCompleteTask = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAsCompleted(notification.id);
      toast({
        title: "Task marked as complete!"
      });
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast({
        title: "Failed to mark task as complete",
        variant: "destructive"
      });
    }
  }, [markAsCompleted, toast]);

  const handleViewAll = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/notifications');
  }, [navigate]);

  const handleMarkAllAsRead = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAllAsRead();
      toast({
        title: "All notifications marked as read"
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "Failed to mark all as read",
        variant: "destructive"
      });
    }
  }, [markAllAsRead, toast]);

  return (
    <div className="w-full min-w-[320px] bg-white">
      <NotificationHeader 
        unreadCount={unreadCount} 
        onMarkAllAsRead={handleMarkAllAsRead} 
        onRefresh={handleRefresh} 
        loading={loading} 
        isRefreshing={isRefreshing} 
      />
      
      <NotificationContent 
        notifications={notifications}
        loading={loading}
        isRefreshing={isRefreshing}
        error={error}
        onViewDetail={handleViewNotification}
        onCompleteTask={handleCompleteTask}
        onRefresh={handleRefresh}
      />
      
      <DropdownMenuSeparator />
      
      <NotificationFooter onViewAll={handleViewAll} />
    </div>
  );
}
