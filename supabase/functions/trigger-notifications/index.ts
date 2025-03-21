
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get environment variables
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  // Use service role for admin privileges (needed to insert notifications)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    console.log('Trigger-notifications function invoked');
    
    // Get request body
    let reqBody = {};
    try {
      if (req.body) {
        const bodyText = await req.text();
        if (bodyText) {
          reqBody = JSON.parse(bodyText);
        }
      }
    } catch (error) {
      console.log('No request body or invalid JSON:', error);
    }
    
    console.log('Request body:', reqBody);
    
    // Since we've simplified our notification system to use client-side mock data,
    // we'll just create manual notifications directly

    // Get specific event codes from request or use defaults
    const specificEvents = (reqBody as any)?.specificEvents || ['EVENT-163-3045', 'EVENT-163-7385'];
    const results = [];
    
    // For each specific event, directly create a notification
    for (const eventCode of specificEvents) {
      console.log(`Creating notification for event ${eventCode}`);
      
      // First check if the event exists
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('event_code, name')
        .eq('event_code', eventCode)
        .maybeSingle();
        
      if (eventError || !eventData) {
        console.error(`Event ${eventCode} not found:`, eventError);
        results.push({ eventCode, status: 'error', message: `Event not found` });
        continue;
      }
      
      console.log(`Found event ${eventCode}: ${eventData.name}`);
      
      // Check if notification already exists
      const { data: existingNotif, error: notifCheckError } = await supabase
        .from('event_notifications')
        .select('id')
        .eq('event_code', eventCode)
        .eq('notification_type', 'event_created_unified')
        .maybeSingle();
        
      if (notifCheckError) {
        console.error(`Error checking existing notifications for ${eventCode}:`, notifCheckError);
      }
      
      // If notification exists, mark it as sent
      if (existingNotif) {
        console.log(`Notification already exists for ${eventCode}, marking as sent`);
        
        const { error: updateError } = await supabase
          .from('event_notifications')
          .update({ 
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingNotif.id);
          
        if (updateError) {
          console.error(`Error updating notification for ${eventCode}:`, updateError);
          results.push({ eventCode, status: 'error', message: `Error updating notification` });
        } else {
          console.log(`Successfully updated notification for ${eventCode}`);
          results.push({ eventCode, status: 'updated', id: existingNotif.id });
        }
      } else {
        // Create new notification
        console.log(`Creating new notification for ${eventCode}`);
        
        const { data: newNotif, error: insertError } = await supabase
          .from('event_notifications')
          .insert({
            event_code: eventCode,
            notification_type: 'event_created_unified',
            scheduled_for: new Date().toISOString(),
            sent_at: new Date().toISOString(), // Mark as sent immediately
          })
          .select()
          .single();
          
        if (insertError) {
          console.error(`Error creating notification for ${eventCode}:`, insertError);
          results.push({ eventCode, status: 'error', message: `Error creating notification` });
        } else {
          console.log(`Successfully created notification for ${eventCode}`);
          results.push({ eventCode, status: 'created', id: newNotif.id });
        }
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: 'Notifications processed directly'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in trigger-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
