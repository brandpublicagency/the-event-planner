
import { processTemplate } from '../utils/templateUtils.ts';

/**
 * Process pending notifications that are ready to be sent
 */
export async function processPendingNotifications(supabase) {
  console.log('Starting to process pending notifications...');
  
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
      
      // Fetch the associated event with more fields
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('event_code, name, event_type, primary_name, event_date, primary_email, primary_phone, secondary_name, secondary_email, secondary_phone, company, venues')
        .eq('event_code', notification.event_code)
        .single();
          
      if (eventError || !eventData) {
        console.error(`Event not found for code ${notification.event_code}:`, eventError);
        continue;
      }
      
      // Get the template for this notification type
      const template = templateMap[notification.notification_type];
      
      if (!template) {
        console.log(`No template found for notification type: ${notification.notification_type}`);
      }
      
      // Process the template with event data if available
      let title = template?.title || formatNotificationType(notification.notification_type);
      let description = template?.description_template || 'Notification for event';
      
      if (template && eventData) {
        try {
          // Format the event date if it exists
          let formattedEventDate = '';
          if (eventData.event_date) {
            const eventDate = new Date(eventData.event_date);
            formattedEventDate = eventDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
          
          // Prepare data for template processing
          const templateData = {
            event_name: eventData.name,
            event_type: eventData.event_type,
            primary_contact: eventData.primary_name,
            event_date: formattedEventDate,
            event_code: eventData.event_code,
            primary_email: eventData.primary_email,
            primary_phone: eventData.primary_phone,
            secondary_name: eventData.secondary_name,
            company: eventData.company,
            // Join venues array if it exists
            venues: Array.isArray(eventData.venues) ? eventData.venues.join(', ') : ''
          };
          
          title = processTemplate(title, templateData);
          description = processTemplate(description, templateData);
        } catch (templateError) {
          console.error(`Error processing template for notification ${notification.id}:`, templateError);
        }
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

      console.log(`Successfully processed notification ${notification.id} for event ${eventData.name}`);
      processedCount++;
      
      results.push({
        notification_id: notification.id,
        event_code: notification.event_code,
        status: 'processed',
        title: title,
        description: description,
        notification_type: notification.notification_type,
        details: `Processed ${notification.notification_type} for ${eventData.name}`
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

  console.log(`Finished processing ${processedCount} pending notifications`);
  return { processed: processedCount, results };
}

/**
 * Format notification type into readable text
 */
function formatNotificationType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
