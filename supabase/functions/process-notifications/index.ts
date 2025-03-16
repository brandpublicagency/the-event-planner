import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.5';
import { format } from 'https://esm.sh/date-fns@3.6.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface NotificationTemplate {
  type: string;
  title: string;
  description_template: string;
  action_type: string | null;
}

interface Event {
  event_code: string;
  name: string;
  event_type: string;
  primary_name: string | null;
  event_date: string | null;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting notification processing');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables for Supabase connection');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('Processing scheduled notifications...');

    // First, clean up duplicate notifications
    await cleanupDuplicateNotifications(supabase);

    // Fetch notification triggers to check what should be processed
    const { data: notificationTriggers, error: triggersError } = await supabase
      .from('notification_triggers')
      .select('*')
      .eq('enabled', true);
    
    if (triggersError) {
      console.error('Error fetching notification triggers:', triggersError);
      throw triggersError;
    }
    
    console.log(`Found ${notificationTriggers?.length || 0} active notification triggers`);
    
    // Create missing notifications for recent events
    const createdCount = await createMissingNotifications(supabase, notificationTriggers);
    
    // Get all pending notifications scheduled for now or earlier
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
      
      return new Response(
        JSON.stringify({ 
          message: 'No pending notifications to process',
          created: createdCount,
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${pendingNotifications.length} pending notifications`);

    // Fetch all templates in one go for efficiency
    const { data: templates, error: templatesError } = await supabase
      .from('notification_templates')
      .select('*');
      
    if (templatesError) {
      console.error('Error fetching notification templates:', templatesError);
      throw templatesError;
    }
    
    // Create a map for quick lookup
    const templateMap = templates ? templates.reduce((acc, template) => {
      acc[template.type] = template;
      return acc;
    }, {}) : {};

    // Process each notification
    let processedCount = 0;
    const results = [];
    
    for (const notification of pendingNotifications) {
      try {
        console.log(`Processing notification ${notification.id} of type ${notification.notification_type} for event ${notification.event_code}`);
        
        // Get the notification template from our map
        const template = templateMap[notification.notification_type];

        // Get the event details (with error handling)
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
        
        // Mark notification as sent
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

    return new Response(
      JSON.stringify({ 
        processed: processedCount,
        created: createdCount,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in processing notifications:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to process template with event data
function processTemplate(template: NotificationTemplate, event: Event): string {
  let description = template.description_template;
  
  // Replace variables in template
  description = description.replace(/{event_name}/g, event.name || 'Untitled Event');
  description = description.replace(/{event_type}/g, event.event_type || 'Event');
  description = description.replace(/{primary_contact}/g, event.primary_name || 'Client');
  
  // Format and replace event_date if it exists
  if (event.event_date && description.includes('{event_date}')) {
    try {
      const formattedDate = format(new Date(event.event_date), 'dd MMMM yyyy');
      description = description.replace(/{event_date}/g, formattedDate);
    } catch (error) {
      console.error('Error formatting event date:', error);
      description = description.replace(/{event_date}/g, event.event_date || 'upcoming date');
    }
  } else {
    description = description.replace(/{event_date}/g, 'upcoming date');
  }
  
  return description;
}

// Function to check for and remove duplicate notifications
async function cleanupDuplicateNotifications(supabase) {
  try {
    console.log('Starting duplicate notification cleanup...');
    
    // Get all sent notifications
    const { data: allNotifications, error: fetchError } = await supabase
      .from('event_notifications')
      .select('id, event_code, notification_type, sent_at, is_read')
      .not('is_completed', 'eq', true)
      .filter('sent_at', 'not.is', null)
      .order('sent_at', { ascending: false });
      
    if (fetchError || !allNotifications) {
      console.error('Error fetching notifications for cleanup:', fetchError);
      return;
    }
    
    console.log(`Found ${allNotifications.length} notifications to check for duplicates`);
    
    // Find duplicates (same event_code and notification_type, keeping the most recent)
    const seen = new Map();
    const duplicates = [];
    
    allNotifications.forEach(notification => {
      const key = `${notification.event_code}_${notification.notification_type}`;
      
      if (seen.has(key)) {
        // Add the older one to duplicates
        duplicates.push(notification.id);
      } else {
        seen.set(key, notification.id);
      }
    });
    
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate notifications to clean up`);
      
      // Mark duplicates as completed so they don't show up
      const { error: updateError } = await supabase
        .from('event_notifications')
        .update({ is_completed: true })
        .in('id', duplicates);
        
      if (updateError) {
        console.error('Error cleaning up duplicate notifications:', updateError);
      } else {
        console.log(`Successfully cleaned up ${duplicates.length} duplicate notifications`);
      }
    } else {
      console.log('No duplicate notifications found');
    }
  } catch (error) {
    console.error('Error during notification cleanup:', error);
  }
}

// Function to check for and create missing notifications
async function createMissingNotifications(supabase, notificationTriggers) {
  try {
    console.log('Checking for missing notifications...');
    
    // Replace the existing specific event code query with the requested query
    // Get recent events created in the last 30 days
    const daysToLookBack = 30;
    const lookBackDate = new Date();
    lookBackDate.setDate(lookBackDate.getDate() - daysToLookBack);

    const { data: recentEvents, error: recentEventsError } = await supabase
      .from('events')
      .select('event_code, name, event_type, primary_name, event_date, created_at')
      .gte('created_at', lookBackDate.toISOString())
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50);  // Set a reasonable limit

    if (recentEventsError) {
      console.error('Error fetching recent events:', recentEventsError);
      throw recentEventsError;
    }
    
    console.log(`Checking ${recentEvents?.length || 0} events for missing notifications...`);
    
    let createdCount = 0;
    
    // Look up the unified notification trigger
    const unifiedTrigger = notificationTriggers.find(trigger => 
      trigger.template_type === 'event_created_unified'
    );
    
    // Look up the final payment reminder trigger
    const paymentReminderTrigger = notificationTriggers.find(trigger => 
      trigger.template_type === 'final_payment_reminder'
    );
    
    // Look up the document due reminder trigger
    const documentDueReminderTrigger = notificationTriggers.find(trigger => 
      trigger.template_type === 'document_due_reminder'
    );
    
    console.log('Found unified trigger:', unifiedTrigger ? 'yes' : 'no');
    console.log('Found payment reminder trigger:', paymentReminderTrigger ? 'yes' : 'no');
    console.log('Found document due reminder trigger:', documentDueReminderTrigger ? 'yes' : 'no');
    
    // Required notification types that should exist for each event
    const requiredTypes = [
      'event_created_unified',   // Unified type
      'event_incomplete',        // Keep this one
      'proforma_reminder',       // Keep this as a separate reminder for 14 days before
      'final_payment_reminder',  // Final payment reminder type
      'document_due_reminder'    // Document due reminder type
    ];
    
    // First, clean up any existing document due reminders that were created too early
    for (const event of recentEvents || []) {
      // Skip events without an event date
      if (!event.event_date) continue;
      
      console.log(`Checking document_due_reminder for event ${event.event_code} (date: ${event.event_date})`);
      
      // Get existing document due reminders for this event
      const { data: existingReminders, error: remindersError } = await supabase
        .from('event_notifications')
        .select('*')
        .eq('event_code', event.event_code)
        .eq('notification_type', 'document_due_reminder')
        .not('is_completed', 'eq', true);
        
      if (remindersError) {
        console.error(`Error checking reminders for event ${event.event_code}:`, remindersError);
        continue;
      }
      
      if (existingReminders && existingReminders.length > 0) {
        console.log(`Found ${existingReminders.length} document due reminders for event ${event.event_code}`);
        
        // Calculate the correct scheduled date (14 days before event)
        const eventDate = new Date(event.event_date);
        const correctReminderDate = new Date(eventDate);
        correctReminderDate.setDate(eventDate.getDate() - 14);
        
        // Mark old reminders as completed
        for (const reminder of existingReminders) {
          // Check if this is an old-style reminder (not based on event date)
          const reminderDate = new Date(reminder.scheduled_for);
          const daysBeforeEvent = Math.round((eventDate.getTime() - reminderDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // If this reminder is scheduled more than 16 days before the event or is in the wrong timeframe
          if (daysBeforeEvent > 16 || daysBeforeEvent < 12) {
            console.log(`Marking outdated document reminder ${reminder.id} as completed (scheduled ${daysBeforeEvent} days before event)`);
            
            // Mark it as completed
            const { error: updateError } = await supabase
              .from('event_notifications')
              .update({ 
                is_completed: true,
                updated_at: new Date().toISOString() 
              })
              .eq('id', reminder.id);
              
            if (updateError) {
              console.error(`Error marking reminder ${reminder.id} as completed:`, updateError);
            }
          }
        }
        
        // Create a new reminder with the correct timing if needed
        if (existingReminders.every(r => r.is_completed)) {
          console.log(`Creating new correctly timed document reminder for event ${event.event_code}`);
          
          // Insert a correctly timed notification
          const { error: insertError } = await supabase
            .from('event_notifications')
            .insert({
              event_code: event.event_code,
              notification_type: 'document_due_reminder',
              scheduled_for: correctReminderDate.toISOString(),
              sent_at: correctReminderDate <= new Date() ? new Date().toISOString() : null,
            });
            
          if (insertError) {
            console.error(`Error creating document due reminder for event ${event.event_code}:`, insertError);
          } else {
            createdCount++;
            console.log(`Created document due reminder for event ${event.event_code}, scheduled for ${correctReminderDate.toISOString()}`);
          }
        }
      }
    }
    
    // For each event, create any missing notifications
    for (const event of recentEvents || []) {
      console.log(`Checking notifications for event ${event.event_code} (${event.name})`);
      
      // Get existing notifications for this event
      const { data: existingNotifications, error: notificationError } = await supabase
        .from('event_notifications')
        .select('notification_type, sent_at')
        .eq('event_code', event.event_code);
        
      if (notificationError) {
        console.error(`Error checking notifications for event ${event.event_code}:`, notificationError);
        continue;
      }
      
      // Create a set of existing notification types
      const existingTypes = new Set(existingNotifications?.map(n => n.notification_type) || []);
      console.log(`Event ${event.event_code} has notifications: ${Array.from(existingTypes).join(', ')}`);
      
      // Check if we need to create the unified notification
      if (!existingTypes.has('event_created_unified')) {
        // If the event has any of the old notification types but not the unified one,
        // we'll create the unified one
        if (existingTypes.has('event_created') || 
            existingTypes.has('document_send_reminder') || 
            existingTypes.has('invoice_reminder')) {
          
          console.log(`Creating unified notification for event ${event.event_code} to replace old types`);
          
          // Insert the unified notification
          const { error: insertError } = await supabase
            .from('event_notifications')
            .insert({
              event_code: event.event_code,
              notification_type: 'event_created_unified',
              scheduled_for: new Date().toISOString(),
              sent_at: new Date().toISOString(), // Mark as sent immediately
            });
            
          if (insertError) {
            console.error(`Error creating unified notification for event ${event.event_code}:`, insertError);
          } else {
            createdCount++;
            console.log(`Created unified notification for event ${event.event_code}`);
            
            // Mark old notification types as completed to hide them
            if (existingTypes.has('event_created') || 
                existingTypes.has('document_send_reminder') || 
                existingTypes.has('invoice_reminder')) {
              
              const { error: updateError } = await supabase
                .from('event_notifications')
                .update({ is_completed: true })
                .eq('event_code', event.event_code)
                .in('notification_type', ['event_created', 'document_send_reminder', 'invoice_reminder']);
                
              if (updateError) {
                console.error(`Error marking old notifications as completed for event ${event.event_code}:`, updateError);
              } else {
                console.log(`Successfully marked old notifications as completed for event ${event.event_code}`);
              }
            }
          }
        }
      }
      
      // Now check for other required notification types
      for (const notificationType of requiredTypes) {
        // Skip event_created_unified if we just added it
        if (notificationType === 'event_created_unified' && 
            (existingTypes.has('event_created_unified') || createdCount > 0)) {
          continue;
        }
        
        // For document_due_reminder, ensure it's not already in the existingTypes
        if (notificationType === 'document_due_reminder' && 
            existingTypes.has('document_due_reminder')) {
          continue;
        }
        
        if (!existingTypes.has(notificationType)) {
          console.log(`Creating missing ${notificationType} notification for event ${event.event_code}`);
          
          // Calculate scheduled time based on notification type
          let scheduledFor = new Date().toISOString();
          let shouldMarkAsSent = false;
          
          if (notificationType === 'event_created_unified') {
            // Event created unified notifications are scheduled immediately
            scheduledFor = new Date().toISOString();
            shouldMarkAsSent = true; // Always send event created notifications immediately
          } else if (notificationType === 'proforma_reminder' && event.event_date) {
            // Pro-forma reminders scheduled 14 days before event
            const eventDate = new Date(event.event_date);
            const reminderDate = new Date(eventDate);
            reminderDate.setDate(eventDate.getDate() - 14);
            scheduledFor = reminderDate.toISOString();
          } else if (notificationType === 'event_incomplete' && event.event_date) {
            // Event incomplete reminders scheduled 7 days before event
            const eventDate = new Date(event.event_date);
            const reminderDate = new Date(eventDate);
            reminderDate.setDate(eventDate.getDate() - 7);
            scheduledFor = reminderDate.toISOString();
          } else if (notificationType === 'final_payment_reminder' && event.event_date) {
            // Final payment reminders scheduled 7 days before event
            const eventDate = new Date(event.event_date);
            const reminderDate = new Date(eventDate);
            reminderDate.setDate(eventDate.getDate() - 7);
            scheduledFor = reminderDate.toISOString();
          } else if (notificationType === 'document_due_reminder' && event.event_date) {
            // Document due reminders scheduled 14 days before event
            const eventDate = new Date(event.event_date);
            const reminderDate = new Date(eventDate);
            reminderDate.setDate(eventDate.getDate() - 14);
            scheduledFor = reminderDate.toISOString();
          }
          
          // Skip if we couldn't calculate a scheduled date (e.g., no event_date for date-dependent notifications)
          if (
            (notificationType === 'document_due_reminder' || 
             notificationType === 'proforma_reminder' || 
             notificationType === 'event_incomplete' ||
             notificationType === 'final_payment_reminder') && 
            !event.event_date
          ) {
            console.log(`Skipping ${notificationType} for event ${event.event_code} - no event date set`);
            continue;
          }
          
          // Mark as sent immediately if scheduled date is in the past
          if (new Date(scheduledFor) <= new Date()) {
            shouldMarkAsSent = true;
          }
          
          // Insert the notification with proper scheduling
          const { error: insertError } = await supabase
            .from('event_notifications')
            .insert({
              event_code: event.event_code,
              notification_type: notificationType,
              scheduled_for: scheduledFor,
              sent_at: shouldMarkAsSent ? new Date().toISOString() : null,
            });
            
          if (insertError) {
            console.error(`Error creating ${notificationType} notification for event ${event.event_code}:`, insertError);
          } else {
            createdCount++;
            console.log(`Created ${notificationType} notification for event ${event.event_code}, sent status: ${shouldMarkAsSent}`);
          }
        } else {
          // Check if notification exists but hasn't been sent yet
          const unsent = existingNotifications.find(n => 
            n.notification_type === notificationType && n.sent_at === null
          );
          
          if (unsent) {
            console.log(`Found unsent ${notificationType} notification for event ${event.event_code}, marking as sent`);
            
            // Mark notification as sent if needed
            const { error: updateError } = await supabase
              .from('event_notifications')
              .update({ 
                sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('event_code', event.event_code)
              .eq('notification_type', notificationType)
              .is('sent_at', null);
              
            if (updateError) {
              console.error(`Error marking ${notificationType} notification as sent:`, updateError);
            } else {
              console.log(`Successfully marked ${notificationType} notification as sent for event ${event.event_code}`);
            }
          }
        }
      }
    }
    
    console.log(`Created ${createdCount} missing notifications`);
    return createdCount;
  } catch (error) {
    console.error('Error creating missing notifications:', error);
    return 0;
  }
}

