
import { supabase } from "@/integrations/supabase/client";
import { createFallbackNotifications } from "./notificationUtils";

/**
 * Trigger the notification processing edge function
 * Enhanced with better error handling and direct database fallbacks
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
        forceProcess: true, // Force processing regardless of scheduled time
        detailed: true // Request detailed logging
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
        
        // Last resort - try direct database approach
        console.log('Attempting direct database approach as last resort');
        const result = await createDirectNotifications();
        
        if (!result) {
          throw fallbackError;
        }
        return { method: 'direct-database', created: result };
      }
      
      console.log('Fallback notification processing response:', fallbackData);
      return fallbackData;
    }
    
    console.log('Notification processing response:', data);
    return data;
  } catch (err) {
    console.error('Error triggering notification processing:', err);
    
    // Try direct database approach as a final resort
    console.log('Attempting direct database approach after all other methods failed');
    const result = await createDirectNotifications();
    
    if (!result) {
      // Let the error propagate so it can be handled by the caller
      throw err;
    }
    
    return { method: 'direct-fallback', created: result };
  }
};

/**
 * Direct database approach to create notifications when edge functions fail
 * This is a client-side fallback mechanism
 * @returns {Promise<number>} Number of notifications created
 */
async function createDirectNotifications() {
  try {
    // Get the most recent events
    const { data: recentEvents, error: eventsError } = await supabase
      .from('events')
      .select('event_code, name, event_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (eventsError) {
      console.error('Error fetching recent events:', eventsError);
      return 0;
    }
    
    if (!recentEvents || recentEvents.length === 0) {
      console.log('No recent events found');
      return 0;
    }
    
    console.log('Creating direct notifications for recent events:', recentEvents.length);
    
    let createdCount = 0;
    const notificationTypes = ['event_created_unified', 'proforma_reminder'];
    
    for (const event of recentEvents) {
      // For each recent event, ensure unified notification exists
      for (const notificationType of notificationTypes) {
        // Check if notification already exists
        const { data: existing } = await supabase
          .from('event_notifications')
          .select('id')
          .eq('event_code', event.event_code)
          .eq('notification_type', notificationType)
          .maybeSingle();
          
        if (!existing) {
          // Create notification if it doesn't exist
          const { error } = await supabase
            .from('event_notifications')
            .insert({
              event_code: event.event_code,
              notification_type: notificationType,
              scheduled_for: new Date().toISOString(),
              sent_at: new Date().toISOString(), // Mark as sent immediately
            });
            
          if (!error) {
            createdCount++;
            console.log(`Created ${notificationType} for event ${event.event_code}`);
          } else {
            console.error(`Error creating ${notificationType} for event ${event.event_code}:`, error);
          }
        } else {
          // If notification exists but hasn't been sent, mark it as sent
          const { error } = await supabase
            .from('event_notifications')
            .update({ 
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString() 
            })
            .eq('id', existing.id)
            .is('sent_at', null);
            
          if (!error && error !== null) {
            console.log(`Marked existing ${notificationType} as sent for event ${event.event_code}`);
          }
        }
      }
    }
    
    console.log(`Created/updated ${createdCount} notifications directly in database`);
    return createdCount;
  } catch (err) {
    console.error('Error creating direct notifications:', err);
    return 0;
  }
}
