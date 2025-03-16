
import { supabase } from "@/integrations/supabase/client";

/**
 * Trigger the notification processing edge function
 * This now only processes immediate notifications and actionable reminders (close to event date)
 */
export const triggerNotificationProcessing = async () => {
  try {
    console.log('Triggering notification processing...');
    
    // Set a shorter timeout for faster response
    const timeoutMs = 6000;
    
    // Create the fetch promise with specific parameters
    const fetchPromise = supabase.functions.invoke('process-notifications', {
      method: 'POST',
      body: { 
        processImmediate: true,
        specificEvents: ['EVENT-163-3045', 'EVENT-163-7385'], // Include the problematic events
        forceProcess: true // Force processing regardless of scheduled time
      }
    });
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Edge function timed out')), timeoutMs)
    );
    
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Error invoking process-notifications function:', error);
      
      // Try to call the trigger-notifications function as a fallback
      console.log('Trying fallback notification trigger...');
      const fallbackPromise = supabase.functions.invoke('trigger-notifications', {
        method: 'POST',
        body: { force: true }
      });
      
      const fallbackTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fallback function timed out')), timeoutMs)
      );
      
      const { data: fallbackData, error: fallbackError } = await Promise.race([fallbackPromise, fallbackTimeoutPromise]) as any;
      
      if (fallbackError) {
        console.error('Error with fallback notification trigger:', fallbackError);
        throw fallbackError;
      }
      
      console.log('Fallback notification processing response:', fallbackData);
      return fallbackData;
    }
    
    console.log('Notification processing response:', data);
    return data;
  } catch (err) {
    console.error('Error triggering notification processing:', err);
    // Let the error propagate so it can be handled by the caller
    throw err;
  }
};
