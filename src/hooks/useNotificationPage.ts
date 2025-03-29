
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/notification';

export type FilterType = 'all' | 'unread' | 'read';

export const useNotificationPage = () => {
  const {
    notifications,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    refreshNotifications,
    loading,
    unreadCount,
    error,
    lastFilterRefresh
  } = useNotifications();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [filterKey, setFilterKey] = useState<number>(0);
  
  // Update filterKey when lastFilterRefresh changes to force re-filtering
  useEffect(() => {
    if (lastFilterRefresh) {
      console.log(`Notifications page: Filter refresh triggered: ${lastFilterRefresh}`);
      setFilterKey(prev => prev + 1);
    }
  }, [lastFilterRefresh]);

  // Filter notifications based on the current filter with proper typing
  const filteredNotifications = notifications.filter(notification => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'unread') return !notification.read;
    if (currentFilter === 'read') return notification.read;
    return true;
  });

  // Log the filtering results for debugging
  useEffect(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const read = notifications.filter(n => n.read).length;
    console.log(`Notification filtering - Total: ${total}, Unread: ${unread}, Read: ${read}, Current filter: ${currentFilter}`);
    console.log(`Filtered notifications count: ${filteredNotifications.length}`);
  }, [notifications, currentFilter, filteredNotifications.length, filterKey]);

  // Handle refresh button click
  const handleRefresh = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsRefreshing(true);
    try {
      const success = await refreshNotifications();
      if (success) {
        toast({
          title: 'Success',
          description: 'Notifications refreshed successfully',
        });
      } else {
        toast({
          title: 'Warning',
          description: 'Notifications may not be up to date',
          variant: 'destructive',
        });
      }
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
      
      // Mark as read first so the UI updates immediately
      const success = await markAsRead(notification.id);
      
      if (success) {
        console.log(`Successfully marked notification ${notification.id} as read`);
        
        // Toast success message
        toast({
          title: "Notification marked as read",
        });
        
        // Force a re-filter to move the notification to the read tab
        setFilterKey(prev => prev + 1);
        
        // Navigate if we have a relatedId
        if (notification.relatedId) {
          console.log(`Page navigating to relatedId: ${notification.relatedId}`);
          
          // For event notifications, use the ID exactly as stored in relatedId
          if (notification.relatedId.match(/^\d+-\d+$/) || 
              notification.relatedId.startsWith('EVENT-') || 
              notification.relatedId.startsWith('event_') ||
              notification.relatedId.match(/^[A-Z]+-\d+-\d+$/)) {  
            
            // Use the event code exactly as is
            const eventCode = notification.relatedId;
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
      } else {
        console.error("Failed to mark notification as read");
        toast({
          title: "Error",
          description: "Failed to mark notification as read",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error handling notification:", error);
      toast({
        title: "Error",
        description: "Failed to process notification",
        variant: "destructive",
      });
    }
  }, [markAsRead, navigate, toast]);

  // Handle marking all as read
  const handleMarkAllAsRead = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const success = await markAllAsRead();
      
      if (success) {
        toast({
          title: "All notifications marked as read",
        });
        
        // Force a re-filter to update the tabs
        setFilterKey(prev => prev + 1);
      } else {
        toast({
          title: "Error",
          description: "Failed to mark all as read",
          variant: "destructive",
        });
      }
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
      const success = await markAsCompleted(notification.id);
      
      if (success) {
        toast({
          title: "Task marked as complete",
        });
        
        // Force a re-filter to update the UI
        setFilterKey(prev => prev + 1);
      } else {
        toast({
          title: "Error",
          description: "Failed to mark task as complete",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark task as complete",
        variant: "destructive",
      });
    }
  }, [markAsCompleted, toast]);

  // Handle filter change
  const handleFilterChange = useCallback((filter: FilterType) => {
    console.log(`Changing filter to: ${filter}`);
    setCurrentFilter(filter);
    // Reset filterKey to ensure we re-filter when changing tabs
    setFilterKey(prev => prev + 1);
  }, []);

  return {
    notifications,
    filteredNotifications,
    loading,
    isRefreshing,
    unreadCount,
    error,
    currentFilter,
    filterKey,
    handleRefresh,
    handleViewDetail,
    handleMarkAllAsRead,
    handleCompleteTask,
    handleFilterChange
  };
};
