
import { supabase } from "@/integrations/supabase/client";

/**
 * Trigger the notification processing (simplified version)
 * We now create notifications automatically via database triggers
 */
export const triggerNotificationProcessing = async () => {
  try {
    console.log('Triggering notification processing...');
    
    // Call the Edge Function to trigger notifications
    const { data, error } = await supabase.functions.invoke('trigger-notifications', {
      method: 'POST',
      body: {}
    });
    
    if (error) {
      console.error('Error invoking trigger-notifications function:', error);
      throw error;
    }
    
    console.log('Notification processing result:', data);
    
    return { 
      processed: 0,
      created: 0,
      method: 'edge-function',
      message: data.message || 'Notifications are now handled automatically'
    };
  } catch (err) {
    console.error('Error triggering notification processing:', err);
    
    return { 
      processed: 0,
      created: 0,
      method: 'error',
      message: 'Error processing notifications'
    };
  }
};
