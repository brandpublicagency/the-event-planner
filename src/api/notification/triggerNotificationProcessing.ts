
import { supabase } from "@/integrations/supabase/client";

/**
 * Trigger the notification processing edge function
 * This now only processes immediate notifications and actionable reminders (close to event date)
 */
export const triggerNotificationProcessing = async () => {
  try {
    console.log('Triggering notification processing...');
    
    // Attempt to call the edge function with a timeout
    const fetchPromise = supabase.functions.invoke('process-notifications', {
      method: 'POST',
      body: { processImmediate: true }
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Edge function timed out')), 10000)
    );
    
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Error invoking process-notifications function:', error);
      throw error;
    }
    
    console.log('Notification processing response:', data);
    return data;
  } catch (err) {
    console.error('Error triggering notification processing:', err);
    // Let the error propagate so it can be handled by the caller
    throw err;
  }
};
