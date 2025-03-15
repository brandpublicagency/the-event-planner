
import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useScheduledNotifications } from '@/contexts/ScheduledNotificationContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useNotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { 
    notifications: scheduledNotifications, 
    markAsRead: markScheduledAsRead, 
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing,
    loading
  } = useScheduledNotifications();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'general');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const handleViewEvent = useCallback((type: 'general' | 'scheduled', id: string, eventCode?: string) => {
    // Mark notification as read
    if (type === 'general') {
      markAsRead(id);
    } else {
      markScheduledAsRead(id);
    }
    
    // Navigate to event if we have an event code
    if (eventCode) {
      navigate(`/events/${eventCode}`);
    }
    
    toast({
      title: "Notification marked as read",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  }, [markAsRead, markScheduledAsRead, navigate, toast]);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
    toast({
      title: "All notifications marked as read",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  }, [markAllAsRead, toast]);

  const handleCompleteTask = useCallback((type: 'general' | 'scheduled', id: string) => {
    markAsCompleted(id);
    toast({
      title: "Task marked as complete",
      description: "The task has been marked as completed successfully",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  }, [markAsCompleted, toast]);

  const handleRefresh = useCallback(() => {
    refreshNotifications();
    toast({
      title: "Refreshing notifications",
      description: "Fetching the latest notifications",
      showProgress: true,
      duration: 3000
    });
  }, [refreshNotifications, toast]);

  const handleTriggerProcess = useCallback(() => {
    triggerNotificationProcessing();
    toast({
      title: "Processing notifications",
      description: "Checking for scheduled notifications",
      showProgress: true,
      duration: 3000
    });
  }, [triggerNotificationProcessing, toast]);

  return {
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
  };
}
