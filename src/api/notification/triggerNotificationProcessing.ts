
import { supabase } from "@/integrations/supabase/client";

/**
 * Trigger the notification processing edge function
 */
export const triggerNotificationProcessing = async () => {
  try {
    console.log('Triggering notification processing...');
    const { data, error } = await supabase.functions.invoke('process-notifications');
    
    if (error) {
      console.error('Error invoking process-notifications function:', error);
      throw error;
    }
    
    console.log('Notification processing response:', data);
    return data;
  } catch (err) {
    console.error('Error triggering notification processing:', err);
    throw err;
  }
};
