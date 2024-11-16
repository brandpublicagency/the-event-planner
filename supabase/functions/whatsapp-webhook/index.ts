import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/x/date_fns@v2.22.1/format/index.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const VERIFY_TOKEN = Deno.env.get('VERIFY_TOKEN');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getEventDetails(eventCode: string) {
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      menu_selections (
        is_custom,
        custom_menu_details,
        starter_type,
        canape_package,
        canape_selections,
        plated_starter,
        notes
      )
    `)
    .eq('event_code', eventCode)
    .single();

  if (error) throw error;
  if (!event) return "Event not found.";

  const menuInfo = event.menu_selections?.[0] 
    ? `Menu Type: ${event.menu_selections[0].is_custom ? 'Custom Menu' : event.menu_selections[0].starter_type || 'Not set'}\n` +
      (event.menu_selections[0].is_custom ? `Custom Details: ${event.menu_selections[0].custom_menu_details || 'None'}\n` : '') +
      (event.menu_selections[0].starter_type === 'canapes' ? `Canapé Package: ${event.menu_selections[0].canape_package || 'Not set'}\n` : '') +
      (event.menu_selections[0].plated_starter ? `Plated Starter: ${event.menu_selections[0].plated_starter}\n` : '')
    : "No menu selected\n";

  return `Event: ${event.name}
Date: ${event.event_date ? format(new Date(event.event_date), 'dd MMM yyyy') : 'Not set'}
Time: ${event.start_time || 'Not set'} - ${event.end_time || 'Not set'}
Type: ${event.event_type}
Guests: ${event.pax || 'Not set'}
${menuInfo}`;
}

async function updateEventMenu(eventCode: string, menuType: string) {
  let updates = {};
  
  switch (menuType.toLowerCase()) {
    case 'harvest':
      updates = {
        is_custom: false,
        starter_type: 'harvest',
        custom_menu_details: null,
        canape_package: null,
        canape_selections: null,
        plated_starter: null
      };
      break;
    case 'custom':
      updates = {
        is_custom: true,
        starter_type: null,
        custom_menu_details: '',
        canape_package: null,
        canape_selections: null,
        plated_starter: null
      };
      break;
    default:
      return "Invalid menu type. Available options: harvest, custom";
  }

  const { error } = await supabase
    .from('menu_selections')
    .upsert({
      event_code: eventCode,
      ...updates
    });

  if (error) throw error;
  return `Menu updated successfully for ${eventCode}! New menu type: ${menuType}`;
}

async function getNextEvent() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(1);

  if (error) throw error;
  if (!events || events.length === 0) return "No upcoming events found.";

  const event = events[0];
  return `Next event: ${event.name} on ${format(new Date(event.event_date), 'dd MMM yyyy')} (${event.event_type})`;
}

async function handleMessage(from: string, message: string) {
  let response = "";
  const lowerMessage = message.toLowerCase();

  try {
    // Check for event code pattern (e.g., EVENT-131124)
    const eventCodeMatch = message.match(/EVENT-\d{6}/);
    
    if (eventCodeMatch) {
      const eventCode = eventCodeMatch[0];
      
      // Check if it's a menu update command
      if (lowerMessage.includes('menu') && (lowerMessage.includes('harvest') || lowerMessage.includes('custom'))) {
        const menuType = lowerMessage.includes('harvest') ? 'harvest' : 'custom';
        response = await updateEventMenu(eventCode, menuType);
      } else {
        // If no specific command, show event details
        response = await getEventDetails(eventCode);
      }
    } else if (lowerMessage.includes('next event')) {
      response = await getNextEvent();
    } else {
      response = `I can help you with:
- Checking your next event (try asking 'When is the next event?')
- View event details (send an event code like 'EVENT-131124')
- Update event menu (send 'EVENT-131124 menu harvest' or 'EVENT-131124 menu custom')`;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    response = "Sorry, I encountered an error processing your request. Please try again.";
  }

  // Send response back to WhatsApp
  const url = `https://graph.facebook.com/v17.0/494335320427022/messages`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: { body: response }
    }),
  });
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle webhook verification
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new Response(challenge, { headers: corsHeaders });
    }
    return new Response('Forbidden', { status: 403, headers: corsHeaders });
  }

  // Handle incoming messages
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('Received webhook:', JSON.stringify(body, null, 2));
      
      // Process each message in the webhook
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        const message = messages[0];
        await handleMessage(message.from, message.text.body);
      }

      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response('Method not allowed', { 
    status: 405, 
    headers: corsHeaders 
  });
});