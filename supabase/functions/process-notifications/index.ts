
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.5';

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
    console.log('Starting notification processing with URL:', SUPABASE_URL);
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables for Supabase connection');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('Processing scheduled notifications...');

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
    
    // Log trigger types for debugging
    notificationTriggers?.forEach(trigger => {
      console.log(`Active trigger: ${trigger.template_type}, type: ${trigger.trigger_type}, days_offset: ${trigger.days_offset}, event_relative: ${trigger.event_relative}`);
    });

    // Get all pending notifications scheduled for now or earlier
    const { data: pendingNotifications, error: notificationsError } = await supabase
      .from('event_notifications')
      .select('*')
      .is('sent_at', null)
      .lte('scheduled_for', new Date().toISOString());

    if (notificationsError) {
      console.error('Error fetching pending notifications:', notificationsError);
      throw notificationsError;
    }

    // Debug log existing notifications
    const { data: existingNotifications, error: existingError } = await supabase
      .from('event_notifications')
      .select('id, event_code, notification_type, scheduled_for, sent_at, is_read')
      .not('sent_at', 'is', null)
      .limit(5);

    if (!existingError && existingNotifications) {
      console.log(`Found ${existingNotifications.length} existing processed notifications for reference:`);
      existingNotifications.forEach(n => {
        console.log(`- ${n.notification_type} for ${n.event_code}, sent: ${n.sent_at}, read: ${n.is_read}`);
      });
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      console.log('No pending notifications to process');
      
      // Check if there are any notifications that should have been created but weren't
      // This is useful to debug issues like the missing proforma_reminder
      await createMissingNotifications(supabase, notificationTriggers);
      
      return new Response(
        JSON.stringify({ 
          message: 'No pending notifications to process',
          created: 0,
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${pendingNotifications.length} pending notifications to process`);

    // Process each notification
    const results = await Promise.allSettled(
      pendingNotifications.map(async (notification) => {
        try {
          console.log(`Processing notification ${notification.id} of type ${notification.notification_type}`);
          
          // Get the notification template
          const { data: template, error: templateError } = await supabase
            .from('notification_templates')
            .select('*')
            .eq('type', notification.notification_type)
            .single();

          if (templateError || !template) {
            console.error(`Template not found for type ${notification.notification_type}:`, templateError);
            throw templateError || new Error(`Template not found for type ${notification.notification_type}`);
          }

          // Get the event details
          const { data: event, error: eventError } = await supabase
            .from('events')
            .select('event_code, name, event_type, primary_name, event_date')
            .eq('event_code', notification.event_code)
            .single();

          if (eventError || !event) {
            console.error(`Event not found for code ${notification.event_code}:`, eventError);
            throw eventError || new Error(`Event not found for code ${notification.event_code}`);
          }

          // Process notification template
          const description = processTemplate(template, event);
          
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

          console.log(`Processed notification ${notification.id} for event ${event.name}`);
          
          return {
            notification_id: notification.id,
            event_code: notification.event_code,
            status: 'processed',
            description
          };
        } catch (error) {
          console.error(`Error processing notification ${notification.id}:`, error);
          return {
            notification_id: notification.id,
            status: 'error',
            error: error.message
          };
        }
      })
    );

    // Check for and create missing notifications
    const createdCount = await createMissingNotifications(supabase, notificationTriggers);

    return new Response(
      JSON.stringify({ 
        processed: results.length,
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
        details: error.stack,
        environment: {
          supabaseUrl: SUPABASE_URL ? 'Set' : 'Not Set',
          serviceKey: SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not Set'
        }
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
  
  return description;
}

// Function to check for and create missing notifications
async function createMissingNotifications(supabase, notificationTriggers) {
  try {
    const { data: recentEvents, error: recentEventsError } = await supabase
      .from('events')
      .select('event_code, name, event_type, primary_name, event_date, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (recentEventsError) {
      console.error('Error fetching recent events:', recentEventsError);
      return 0;
    }

    console.log(`Checking ${recentEvents?.length || 0} recent events for missing notifications...`);
    
    let createdCount = 0;
    
    // For each recent event, create any missing notification types
    for (const event of recentEvents || []) {
      // Get existing notifications for this event
      const { data: existingNotifications, error: notificationError } = await supabase
        .from('event_notifications')
        .select('notification_type')
        .eq('event_code', event.event_code);
        
      if (notificationError) {
        console.error(`Error checking notifications for event ${event.event_code}:`, notificationError);
        continue;
      }
      
      // Create a set of existing notification types
      const existingTypes = new Set(existingNotifications?.map(n => n.notification_type) || []);
      
      // Always ensure the basic types exist - don't rely on triggers alone
      const requiredTypes = ['event_created', 'proforma_reminder', 'event_incomplete'];
      
      for (const notificationType of requiredTypes) {
        if (!existingTypes.has(notificationType)) {
          console.log(`Creating missing ${notificationType} notification for event ${event.event_code}`);
          
          // Insert the notification
          const { error: insertError } = await supabase
            .from('event_notifications')
            .insert({
              event_code: event.event_code,
              notification_type: notificationType,
              scheduled_for: new Date().toISOString(),
            });
            
          if (insertError) {
            console.error(`Error creating ${notificationType} notification for event ${event.event_code}:`, insertError);
          } else {
            createdCount++;
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
