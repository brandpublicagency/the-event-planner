
import { processTemplate } from '../utils/templateUtils.ts';

/**
 * Process pending notifications that are ready to be sent
 */
export async function processPendingNotifications(supabase) {
  // Fetch pending notifications
  const { data: pendingNotifications, error: notificationsError } = await supabase
    .from('event_notifications')
    .select('*')
    .filter('sent_at', 'is', null)
    .lte('scheduled_for', new Date().toISOString());

  if (notificationsError) {
    console.error('Error fetching pending notifications:', notificationsError);
    throw notificationsError;
  }

  if (!pendingNotifications || pendingNotifications.length === 0) {
    console.log('No pending notifications to process');
    return { processed: 0, results: [] };
  }

  console.log(`Processing ${pendingNotifications.length} pending notifications`);

  // Fetch templates for notification formatting
  const { data: templates, error: templatesError } = await supabase
    .from('notification_templates')
    .select('*');
    
  if (templatesError) {
    console.error('Error fetching notification templates:', templatesError);
    throw templatesError;
  }
  
  const templateMap = templates ? templates.reduce((acc, template) => {
    acc[template.type] = template;
    return acc;
  }, {}) : {};

  let processedCount = 0;
  const results = [];
  
  // Process each notification
  for (const notification of pendingNotifications) {
    try {
      console.log(`Processing notification ${notification.id} of type ${notification.notification_type} for event ${notification.event_code}`);
      
      // Skip proforma reminders
      if (notification.notification_type === 'proforma_reminder') {
        console.log(`Skipping proforma reminder notification ${notification.id}`);
        
        // Mark as completed so it doesn't get processed again
        const { error: updateError } = await supabase
          .from('event_notifications')
          .update({ 
            is_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', notification.id);
          
        if (updateError) {
          console.error(`Error marking proforma notification ${notification.id} as completed:`, updateError);
        }
        
        continue;
      }
      
      // Get the template for this notification type
      const template = templateMap[notification.notification_type];

      // Fetch the associated event
      let event = null;
      try {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('event_code, name, event_type, primary_name, event_date')
          .eq('event_code', notification.event_code)
          .single();
          
        if (!eventError && eventData) {
          event = eventData;
        } else {
          console.error(`Event not found for code ${notification.event_code}:`, eventError);
        }
      } catch (eventFetchError) {
        console.error(`Error fetching event ${notification.event_code}:`, eventFetchError);
      }

      if (!event) {
        console.log(`Skipping notification ${notification.id} - event ${notification.event_code} not found`);
        continue;
      }
      
      // Mark the notification as sent
      const { error: updateError } = await supabase
        .from('event_notifications')
        .update({ 
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', notification.id);

      if (updateError) {
        console.error(`Error updating notification ${notification.id}:`, updateError);
        throw updateError;
      }

      console.log(`Successfully processed notification ${notification.id} for event ${event.name}`);
      processedCount++;
      
      results.push({
        notification_id: notification.id,
        event_code: notification.event_code,
        status: 'processed',
        description: `Processed ${notification.notification_type} for ${event.name}`
      });
    } catch (error) {
      console.error(`Error processing notification ${notification.id}:`, error);
      results.push({
        notification_id: notification.id,
        status: 'error',
        error: error.message
      });
    }
  }

  return { processed: processedCount, results };
}
