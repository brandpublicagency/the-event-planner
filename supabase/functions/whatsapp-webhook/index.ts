import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getEventDetails, getHelpMessage, getWelcomeMessage } from './messageHandlers.ts';
import { sendWhatsAppMessage } from './whatsappApi.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VERIFY_TOKEN = Deno.env.get('VERIFY_TOKEN');

async function handleMessage(from: string, message: any) {
  console.log('Handling message:', JSON.stringify(message, null, 2));
  
  try {
    let response;
    
    // Check if it's an interactive message (list response)
    if (message.type === 'interactive' && message.interactive?.type === 'list_reply') {
      console.log('Processing list reply:', message.interactive.list_reply);
      response = await getEventDetails(message.interactive.list_reply.id);
    } 
    // Check if it's a text message
    else if (message.type === 'text' && message.text?.body) {
      const messageText = message.text.body.toLowerCase().trim();
      console.log('Processing text message:', messageText);
      
      if (['hi', 'hello', 'hey'].includes(messageText)) {
        response = await getWelcomeMessage();
      } else if (messageText === 'help') {
        response = getHelpMessage();
      } else {
        // Default to welcome message for unrecognized commands
        response = await getWelcomeMessage();
      }
    } else {
      console.log('Unknown message type:', message.type);
      response = {
        type: 'text',
        message: "I don't understand this type of message. Try sending 'hi' or 'help'."
      };
    }

    if (!response) {
      throw new Error('No response generated');
    }

    console.log('Sending response:', JSON.stringify(response, null, 2));
    await sendWhatsAppMessage(from, response);
    
  } catch (error) {
    console.error('Error handling message:', error);
    const errorMessage = { 
      type: 'text',
      message: "Sorry, I encountered an error processing your request. Please try again later."
    };
    await sendWhatsAppMessage(from, errorMessage);
  }
}

serve(async (req) => {
  // Add detailed request logging
  console.log('Received webhook request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      console.log('Webhook verification request:', { mode, token, challenge });

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge, { headers: corsHeaders });
      }
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      console.log('Received webhook body:', JSON.stringify(body, null, 2));
      
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (!messages || messages.length === 0) {
        console.log('No messages found in webhook');
        return new Response(JSON.stringify({ status: 'no messages' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const message = messages[0];
      if (!message.from) {
        console.error('Invalid message format - no from field:', message);
        throw new Error('Invalid message format');
      }

      await handleMessage(message.from, message);

      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});