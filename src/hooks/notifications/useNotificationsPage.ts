
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/types/notification';
import { useNotificationSystem } from './useNotificationSystem';
import { useTabState } from './useTabState';
import { useNotificationHandlers } from './useNotificationHandlers';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useNotificationsPage() {
  const [activeTab, setActiveTab] = useTabState();
  const {
    pendingNotifications,
    loading,
    markAsRead,
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing
  } = useNotificationSystem();
  
  // Add loading state for button actions
  const [isActionLoading, setIsActionLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Group and sort notifications
  const notifications = pendingNotifications;

  const { handleNotificationAction } = useNotificationHandlers();

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
    handleNotificationAction(notificationId, 'complete');
  }, [handleNotificationAction]);

  // Handler for refreshing the list
  const handleRefresh = useCallback(async () => {
    setIsActionLoading(true);
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
    } finally {
      setIsActionLoading(false);
    }
  }, [refreshNotifications, toast]);

  // Handler for triggering the notification processing
  const handleTriggerProcess = useCallback(async () => {
    setIsActionLoading(true);
    try {
      const result = await triggerNotificationProcessing();
      await refreshNotifications();
      
      toast({
        title: "Processing complete",
        description: `Processed ${result?.processed || 0} notifications`,
        variant: "success"
      });
    } catch (error) {
      console.error('Error triggering notification process:', error);
      toast({
        title: "Error",
        description: "Failed to process notifications",
        variant: "destructive"
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [triggerNotificationProcessing, refreshNotifications, toast]);

  // New handler for checking missing notifications
  const handleManualNotificationCheck = useCallback(async () => {
    setIsActionLoading(true);
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
    loading: loading || isActionLoading,
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess,
    handleManualNotificationCheck
  };
}
