
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook that provides functionality for triggering notification processing
 */
export function useNotificationProcessing() {
  const { toast } = useToast();

  // Trigger manual notification processing (primarily for testing)
  const triggerNotificationProcessing = useCallback(async () => {
    try {
      toast({
        title: 'Processing notifications',
        description: 'Checking for scheduled notifications...',
        variant: 'default',
        showProgress: true,
      });
      
      const { data, error } = await supabase.functions.invoke('process-notifications');
      
      if (error) {
        console.error('Error triggering notifications:', error);
        toast({
          title: 'Error processing notifications',
          description: 'There was a problem triggering the notification process.',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Notification processing response:', data);
      
      toast({
        title: 'Notifications processed',
        description: `Processed ${data?.processed || 0} notifications.`,
        variant: 'success',
      });
      
      return data;
    } catch (err) {
      console.error('Error triggering notifications:', err);
      return null;
    }
  }, [toast]);

  return {
    triggerNotificationProcessing
  };
}
