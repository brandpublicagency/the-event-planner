import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getEventDetails, updateEventMenu, getNextEvent, getHelpMessage, getWelcomeMessage } from './messageHandlers.ts';
import { sendWhatsAppMessage } from './whatsappApi.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VERIFY_TOKEN = Deno.env.get('VERIFY_TOKEN');

async function handleMessage(from: string, message: string) {
  console.log('Received message:', message, 'from:', from);
  
  try {
    let response;
    const lowerMessage = message.toLowerCase().trim();

    // Check if this is the first message or a help request
    if (lowerMessage === 'hi' || lowerMessage === 'hello' || lowerMessage === 'hey') {
      console.log('Generating welcome message');
      response = await getWelcomeMessage();
      console.log('Generated welcome message:', response);
    } else if (lowerMessage === 'help') {
      response = { message: getHelpMessage() };
    } else if (lowerMessage === 'next event') {
      response = { message: await getNextEvent() };
    } else {
      // Check for event code pattern (e.g., EVENT-131124)
      const eventCodeMatch = message.match(/EVENT-\d{6}/i);
      
      if (eventCodeMatch) {
        const eventCode = eventCodeMatch[0].toUpperCase();
        console.log('Found event code:', eventCode);
        
        // Check if it's a menu update command
        if (lowerMessage.includes('menu')) {
          if (lowerMessage.includes('harvest')) {
            response = { message: await updateEventMenu(eventCode, 'harvest') };
          } else if (lowerMessage.includes('custom')) {
            response = { message: await updateEventMenu(eventCode, 'custom') };
          } else {
            response = { message: "Invalid menu type. Please use 'harvest' or 'custom'." };
          }
        } else {
          // If no specific command, show event details
          response = { message: await getEventDetails(eventCode) };
        }
      } else {
        // Default to help message for unrecognized commands
        response = { message: getHelpMessage() };
      }
    }

    console.log('Sending response:', response);
    await sendWhatsAppMessage(from, response);
    
  } catch (error) {
    console.error('Error handling message:', error);
    const errorMessage = "Sorry, I encountered an error processing your request. Please try again.";
    await sendWhatsAppMessage(from, { message: errorMessage });
  }
}

serve(async (req) => {
  try {
    console.log('Received webhook request:', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

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

      console.log('Verification request:', { mode, token, challenge });

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge, { headers: corsHeaders });
      }
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    // Handle incoming messages
    if (req.method === 'POST') {
      const body = await req.json();
      console.log('Received webhook payload:', JSON.stringify(body, null, 2));
      
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (!messages || messages.length === 0) {
        console.log('No messages in webhook payload');
        return new Response(JSON.stringify({ status: 'no messages' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const message = messages[0];
      if (!message.from || !message.text?.body) {
        console.error('Invalid message format:', message);
        return new Response(JSON.stringify({ status: 'invalid message format' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      await handleMessage(message.from, message.text.body);

      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Fatal error in webhook handler:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});