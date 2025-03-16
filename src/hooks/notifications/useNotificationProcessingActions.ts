
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook that provides notification processing actions
 */
export function useNotificationProcessingActions(
  triggerNotificationProcessing,
  refreshNotifications
) {
  const { toast } = useToast();

  // Handler for triggering the notification processing
  const handleTriggerProcess = useCallback(async () => {
    try {
      // This may fail due to edge function issues, but we'll handle the error
      const result = await triggerNotificationProcessing();
      await refreshNotifications();
      
      toast({
        title: "Processing complete",
        description: `Processed ${result?.processed || 0} notifications`,
        variant: "success"
      });
      
      return result;
    } catch (error) {
      console.error('Error triggering notification process:', error);
      // Create local notifications if the edge function fails
      await fetchNotificationsFromDatabase();
      
      toast({
        title: "Error processing notifications",
        description: "Using local data instead of edge function",
        variant: "default"
      });
      
      throw error;
    }
  }, [triggerNotificationProcessing, refreshNotifications, toast]);

  // Function to directly fetch notifications from database if edge function fails
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

  // Handler for checking missing notifications
  const handleManualNotificationCheck = useCallback(async () => {
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
      
      return fixedCount;
    } catch (error) {
      console.error('Error checking for missing notifications:', error);
      toast({
        title: "Error",
        description: "Failed to check for missing notifications",
        variant: "destructive"
      });
      throw error;
    }
  }, [refreshNotifications, toast]);

  return {
    handleTriggerProcess,
    handleManualNotificationCheck,
    fetchNotificationsFromDatabase
  };
}
