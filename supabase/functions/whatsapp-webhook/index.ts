import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getEventDetails, updateEventMenu, getNextEvent, getHelpMessage } from './messageHandlers.ts';
import { sendWhatsAppMessage } from './whatsappApi.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VERIFY_TOKEN = Deno.env.get('VERIFY_TOKEN');

async function handleMessage(from: string, message: string) {
  console.log('Received message:', message, 'from:', from);
  
  try {
    let response = "";
    const lowerMessage = message.toLowerCase();

    // Check for help command first
    if (lowerMessage === 'help') {
      response = getHelpMessage();
    } else {
      // Check for event code pattern (e.g., EVENT-131124)
      const eventCodeMatch = message.match(/EVENT-\d{6}/);
      
      if (eventCodeMatch) {
        const eventCode = eventCodeMatch[0];
        console.log('Found event code:', eventCode);
        
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
        // Default to help message for unrecognized commands
        response = getHelpMessage();
      }
    }

    console.log('Sending response:', response);
    await sendWhatsAppMessage(from, response);
    
  } catch (error) {
    console.error('Error handling message:', error);
    const errorMessage = "Sorry, I encountered an error processing your request. Please try again.";
    await sendWhatsAppMessage(from, errorMessage);
  }
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