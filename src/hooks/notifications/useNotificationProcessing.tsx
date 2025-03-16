
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
      
      console.log('Invoking process-notifications function...');
      
      // Attempt to call the edge function with a timeout
      const fetchPromise = supabase.functions.invoke('process-notifications');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Edge function timed out')), 5000)
      );
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('Error invoking notifications function:', error);
        toast({
          title: 'Using local notification processing',
          description: 'Edge function unavailable - fetching notifications directly.',
          variant: 'default',
        });
        
        // Return a fallback result to allow processing to continue
        return { processed: 0, created: 0, localFallback: true };
      }
      
      console.log('Notification processing response:', data);
      
      toast({
        title: 'Notifications processed',
        description: `Processed ${data?.processed || 0} notifications, created ${data?.created || 0} new notifications.`,
        variant: 'success',
      });
      
      return data;
    } catch (err) {
      console.error('Error triggering notifications:', err);
      toast({
        title: 'Using local notification data',
        description: 'Edge function unavailable - using local data instead.',
        variant: 'default',
      });
      
      // Return a fallback result to allow processing to continue
      return { processed: 0, created: 0, localFallback: true };
    }
  }, [toast]);

  return {
    triggerNotificationProcessing
  };
}
