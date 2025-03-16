
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/types/notification';
import { useNotificationSystem } from './useNotificationSystem';
import { useTabState } from './useTabState';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useNotificationsPage() {
  // Fix the destructuring - useTabState returns an object, not an array
  const tabState = useTabState();
  const activeTab = tabState.activeTab;
  const setActiveTab = tabState.handleTabChange;
  
  const {
    pendingNotifications,
    loading: systemLoading,
    error: systemError,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing
  } = useNotificationSystem();
  
  // Add loading state for button actions
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Group and sort notifications
  const notifications = pendingNotifications;
  const loading = systemLoading || isActionLoading;

  // If there's a system error, capture it
  useEffect(() => {
    if (systemError) {
      setError(systemError);
    }
  }, [systemError]);

  // Handler for viewing event details
  const handleViewEvent = useCallback((listType: string, notificationId: string, eventCode?: string) => {
    if (!eventCode) return;
    
    // Mark as read before navigation
    markAsRead(notificationId).then(() => {
      navigate(`/events/${eventCode}`);
    });
  }, [markAsRead, navigate]);

  // Handler for marking all notifications as read
  const handleMarkAllRead = useCallback(async () => {
    try {
      setIsActionLoading(true);
      setError(null);
      await Promise.all(
        pendingNotifications
          .filter(n => !n.read)
          .map(n => markAsRead(n.id))
      );
      toast({
        title: "Notifications marked as read",
        description: "All notifications have been marked as read",
        variant: "success"
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      setError(error instanceof Error ? error : new Error('Failed to mark notifications as read'));
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [pendingNotifications, markAsRead, toast]);

  // Handler for task completion
  const handleCompleteTask = useCallback((listType: string, notificationId: string) => {
    // Fix: directly call markAsCompleted instead of non-existent handleNotificationAction
    markAsCompleted(notificationId).then(() => {
      toast({
        title: "Task completed",
        description: "The task has been marked as completed",
        variant: "success"
      });
    }).catch(error => {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete the task",
        variant: "destructive"
      });
    });
  }, [markAsCompleted, toast]);

  // Handler for refreshing the list
  const handleRefresh = useCallback(async () => {
    setIsActionLoading(true);
    setError(null);
    try {
      await refreshNotifications();
      toast({
        title: "Refreshed",
        description: "Notification list has been refreshed",
        variant: "success",
        duration: 2000
      });
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      setError(error instanceof Error ? error : new Error('Failed to refresh notifications'));
    } finally {
      setIsActionLoading(false);
    }
  }, [refreshNotifications, toast]);

  // Handler for triggering the notification processing
  const handleTriggerProcess = useCallback(async () => {
    setIsActionLoading(true);
    setError(null);
    try {
      // This may fail due to edge function issues, but we'll handle the error
      const result = await triggerNotificationProcessing();
      await refreshNotifications();
      
      toast({
        title: "Processing complete",
        description: `Processed ${result?.processed || 0} notifications`,
        variant: "success"
      });
    } catch (error) {
      console.error('Error triggering notification process:', error);
      // Create local notifications if the edge function fails
      await fetchNotificationsFromDatabase();
      
      setError(error instanceof Error ? error : new Error('Failed to process notifications'));
      toast({
        title: "Error processing notifications",
        description: "Using local data instead of edge function",
        variant: "default"
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [triggerNotificationProcessing, refreshNotifications, toast]);

  // New function to directly fetch notifications from database if edge function fails
  const fetchNotificationsFromDatabase = useCallback(async () => {
    try {
      // Manually fetch event notifications from the database
      const { data, error } = await supabase
        .from('event_notifications')
        .select(`
          id,
          event_code,
          notification_type,
          scheduled_for,
          sent_at,
          is_read,
          is_completed,
          created_at,
          events:events!inner(name, event_type, primary_name)
        `)
        .is('is_read', false)
        .not('sent_at', 'is', null)
        .order('scheduled_for', { ascending: false });

      if (error) throw error;
      
      console.log('Manually fetched notifications:', data);
      
      // Force refresh of notifications
      await refreshNotifications();
    } catch (err) {
      console.error('Error fetching notifications from database:', err);
    }
  }, [refreshNotifications]);

  // New handler for checking missing notifications
  const handleManualNotificationCheck = useCallback(async () => {
    setIsActionLoading(true);
    setError(null);
    try {
      toast({
        title: "Checking notifications",
        description: "Looking for missing notifications...",
        variant: "default",
        showProgress: true,
      });
      
      // Get recent events
      const { data: recentEvents, error: eventsError } = await supabase
        .from('events')
        .select('event_code, name, created_at')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (eventsError) throw eventsError;
      
      let fixedCount = 0;
      
      for (const event of recentEvents || []) {
        // Check if a pro-forma notification exists
        const { data: existingProforma, error: proformaError } = await supabase
          .from('event_notifications')
          .select('id')
          .eq('event_code', event.event_code)
          .eq('notification_type', 'proforma_reminder')
          .limit(1);
          
        if (proformaError) throw proformaError;
        
        // If no pro-forma notification, create one
        if (!existingProforma || existingProforma.length === 0) {
          const { error: insertError } = await supabase
            .from('event_notifications')
            .insert({
              event_code: event.event_code,
              notification_type: 'proforma_reminder',
              scheduled_for: new Date().toISOString(),
            });
            
          if (insertError) throw insertError;
          fixedCount++;
        }
      }
      
      await refreshNotifications();
      
      toast({
        title: "Check complete",
        description: `Created ${fixedCount} missing notifications`,
        variant: "success"
      });
    } catch (error) {
      console.error('Error checking for missing notifications:', error);
      setError(error instanceof Error ? error : new Error('Failed to check for missing notifications'));
      toast({
        title: "Error",
        description: "Failed to check for missing notifications",
        variant: "destructive"
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [refreshNotifications, toast]);

  return {
    activeTab,
    setActiveTab,
    notifications,
    loading,
    error,
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess,
    handleManualNotificationCheck
  };
}
