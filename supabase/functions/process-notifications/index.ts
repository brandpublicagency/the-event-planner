
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
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    console.log('Processing scheduled notifications...');

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

    if (!pendingNotifications || pendingNotifications.length === 0) {
      console.log('No pending notifications to process');
      return new Response(
        JSON.stringify({ message: 'No pending notifications to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${pendingNotifications.length} pending notifications`);

    // Process each notification
    const results = await Promise.allSettled(
      pendingNotifications.map(async (notification) => {
        try {
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

    return new Response(
      JSON.stringify({ 
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in processing notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
  description = description.replace('{event_name}', event.name || 'Untitled Event');
  description = description.replace('{event_type}', event.event_type || 'Event');
  description = description.replace('{primary_contact}', event.primary_name || 'Client');
  
  return description;
}
