
import React, { useCallback, useEffect, useState } from 'react';
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Notification } from "@/types/notification";
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationContent } from '@/components/notifications/NotificationContent';
import { NotificationFooter } from '@/components/notifications/NotificationFooter';
import { navigateToNotificationTarget } from '@/utils/notificationNavigation';

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
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread'>('unread');
  const [filterKey, setFilterKey] = useState<number>(0);

  useEffect(() => {
    if (!dropdownInitialized) {
      setDropdownInitialized(true);
      refreshNotifications().catch(err => {
        console.error("Error refreshing notifications in dropdown:", err);
      });
    }
  }, [refreshNotifications, dropdownInitialized]);

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(n => 
      currentFilter === 'all' ? true : !n.read
    );
  }, [notifications, currentFilter, filterKey]);

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
      const success = await markAsRead(notification.id);
      
      if (success) {
        setFilterKey(prev => prev + 1);
        navigateToNotificationTarget(notification, navigate);
        
        toast({
          title: "Notification marked as read",
          variant: "success"
        });
      }
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
      setFilterKey(prev => prev + 1);
      
      toast({
        title: "Task marked as complete",
        variant: "success"
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
      const success = await markAllAsRead();
      
      if (success) {
        setFilterKey(prev => prev + 1);
        
        toast({
          title: "All notifications marked as read",
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "Failed to mark all as read",
        variant: "destructive"
      });
    }
  }, [markAllAsRead, toast]);

  return (
    <div className="w-full min-w-[320px] bg-popover">
      <NotificationHeader 
        unreadCount={unreadCount} 
        onMarkAllAsRead={handleMarkAllAsRead} 
        onRefresh={handleRefresh} 
        loading={loading} 
        isRefreshing={isRefreshing} 
      />
      
      <NotificationContent 
        notifications={filteredNotifications}
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
