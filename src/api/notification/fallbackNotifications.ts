
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { triggerNotificationProcessing } from "./triggerNotificationProcessing";
import { formatNotifications } from "./formatNotifications";
import { createFallbackNotifications, notificationExistsForEvent } from "./notificationUtils";

/**
 * Attempts various fallback mechanisms to provide notifications when primary method fails
 * Extracted to separate function to improve readability and maintainability
 */
export async function attemptFallbackNotifications(): Promise<Notification[]> {
  // FALLBACK 1: Try to trigger notification processing to create notifications
  try {
    console.log('Fallback 1: Triggering notification processing');
    await triggerNotificationProcessing().catch(err => {
      console.log('Notification processing failed, continuing with next fallback:', err);
    });
    
    // Try fetching again after processing, with a slight delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { data: retryData, error: retryError } = await supabase
      .from('event_notifications')
      .select(`
        id,
        event_code,
        notification_type,
        sent_at,
        is_read,
        is_completed,
        created_at,
        events:events!inner(name, event_type, primary_name, event_date)
      `)
      .not('is_completed', 'eq', true)
      .not('sent_at', 'is', null)
      .order('sent_at', { ascending: false })
      .limit(20);
      
    if (retryError) {
      console.error('Error in retry fetch:', retryError);
    } else if (retryData && retryData.length > 0) {
      console.log('Fetched notifications after processing:', retryData.length);
      const formattedRetryNotifications = await formatNotifications(retryData);
      return formattedRetryNotifications;
    }
  } catch (processingError) {
    console.error('Error during notification processing:', processingError);
  }
  
  // FALLBACK 2: Check pending notifications that haven't been sent yet
  try {
    console.log('Fallback 2: Checking pending notifications');
    const { data: pendingNotifications, error: pendingError } = await supabase
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
        events:events!inner(name, event_type, primary_name, event_date)
      `)
      .not('is_completed', 'eq', true)
      .is('sent_at', null)  // These are the ones not processed by the edge function
      .lte('scheduled_for', new Date().toISOString())  // Only those scheduled for now or earlier
      .order('scheduled_for', { ascending: false })
      .limit(20);
      
    if (!pendingError && pendingNotifications && pendingNotifications.length > 0) {
      console.log('Found pending notifications:', pendingNotifications.length);
      
      // Mark these as "sent" in the database since the edge function failed to do so
      const updatePromises = pendingNotifications.map(notification => 
        supabase
          .from('event_notifications')
          .update({ 
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          })
          .eq('id', notification.id)
      );
      
      try {
        // Don't wait for these to complete to avoid delays
        Promise.all(updatePromises).catch(err => {
          console.error('Error updating pending notifications:', err);
        });
        
        // Format and return these notifications
        const formattedPendingNotifications = await formatNotifications(pendingNotifications);
        return formattedPendingNotifications;
      } catch (formatError) {
        console.error('Error formatting pending notifications:', formatError);
      }
    }
  } catch (pendingError) {
    console.error('Error checking pending notifications:', pendingError);
  }
  
  // FALLBACK 3: Just fetch recent events and create virtual notifications
  try {
    console.log('Fallback 3: Creating notifications from recent events');
    const daysToLookBack = 30;
    const lookBackDate = new Date();
    lookBackDate.setDate(lookBackDate.getDate() - daysToLookBack);
    
    const { data: recentEvents } = await supabase
      .from('events')
      .select('event_code, name, created_at, event_type, primary_name, event_date')
      .gte('created_at', lookBackDate.toISOString())
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (recentEvents && recentEvents.length > 0) {
      console.log('Creating fallback notifications from recent events:', recentEvents.length);
      return await createFallbackNotifications(recentEvents);
    }
  } catch (fallbackError) {
    console.error('Error in fallback notification creation:', fallbackError);
  }
  
  // If all else fails, return a friendly message
  console.log('All fallback methods failed, returning empty notifications array with friendly message');
  return [{
    id: 'fallback-notification',
    title: 'No Notifications Available',
    description: 'We were unable to load your notifications. Please try again later.',
    createdAt: new Date(),
    type: 'event_created_unified',
    read: false,
    status: 'sent'
  }];
}
