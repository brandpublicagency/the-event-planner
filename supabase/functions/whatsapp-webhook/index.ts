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
  try {
    let response;
    
    // Handle interactive messages
    if (message.type === 'interactive') {
      if (message.interactive.type === 'list_reply') {
        const eventCode = message.interactive.list_reply.id;
        response = { message: await getEventDetails(eventCode) };
      }
    } else if (message.text) {
      // Handle text messages
      const messageText = message.text.body.toLowerCase().trim();
      
      if (messageText === 'hi' || messageText === 'hello' || messageText === 'hey') {
        response = await getWelcomeMessage();
      } else if (messageText === 'help') {
        response = { message: getHelpMessage() };
      } else {
        response = await getWelcomeMessage();
      }
    } else {
      response = await getWelcomeMessage();
    }

    if (!response) {
      throw new Error('No response generated');
    }

    await sendWhatsAppMessage(from, response);
    
  } catch (error) {
    console.error('Error handling message:', error);
    const errorMessage = { 
      message: "Sorry, I encountered an error processing your request. Please try sending 'hi' or 'help'."
    };
    await sendWhatsAppMessage(from, errorMessage);
  }
}

serve(async (req) => {
  try {
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
      const body = await req.json();
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (!messages || messages.length === 0) {
        return new Response(JSON.stringify({ status: 'no messages' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const message = messages[0];
      if (!message.from) {
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