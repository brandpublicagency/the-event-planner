
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleMessage } from './handlers/messageHandler.ts';
import { sendWhatsAppMessage } from './whatsappApi.ts';
import { corsHeaders } from '../_shared/cors.ts';

const VERIFY_TOKEN = Deno.env.get('VERIFY_TOKEN');

serve(async (req) => {
  console.log('Webhook request received:', {
    method: req.method,
    url: req.url
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Handle webhook verification
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      console.log('Webhook verification:', { mode, token });

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified successfully');
        return new Response(challenge, { headers: corsHeaders });
      }
      console.error('Failed webhook verification:', { mode, token, expected: VERIFY_TOKEN });
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    // Handle incoming messages
    if (req.method === 'POST') {
      let body;
      try {
        body = await req.json();
        console.log('Webhook payload received:', JSON.stringify(body, null, 2));
      } catch (jsonError) {
        console.error('Error parsing webhook payload:', jsonError);
        return new Response(JSON.stringify({ status: 'error', message: 'Invalid JSON' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      // Extract entry and changes from the payload
      const entry = body.entry?.[0];
      if (!entry) {
        console.error('Invalid webhook format: missing entry');
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const changes = entry.changes?.[0];
      if (!changes) {
        console.error('Invalid webhook format: missing changes');
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const value = changes.value;
      if (!value) {
        console.error('Invalid webhook format: missing value');
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Extract the phone number ID from the metadata
      const phoneNumberId = value.metadata?.phone_number_id;
      
      if (!phoneNumberId) {
        console.error('Missing phone_number_id in metadata');
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      console.log('Using phone number ID from webhook:', phoneNumberId);
      
      // Process the messages (if any)
      const messages = value.messages;
      if (!messages?.length) {
        console.log('No messages in webhook payload - likely a status update');
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const message = messages[0];
      if (!message?.from) {
        console.error('Invalid message format - missing from field:', message);
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Processing message from:', message.from);
      
      try {
        // Process the message
        const response = await handleMessage(message);
        console.log('Generated response type:', response?.type);

        if (!response) {
          console.error('No response generated from handleMessage');
          const fallbackResponse = {
            type: 'text',
            message: "I apologize, but I wasn't able to generate a response. Please try again."
          };
          
          await sendWhatsAppMessage(message.from, fallbackResponse, phoneNumberId);
          console.log('Sent fallback response');
        } else {
          // Send the response to WhatsApp
          console.log('Sending response to WhatsApp:', JSON.stringify(response, null, 2));
          const result = await sendWhatsAppMessage(message.from, response, phoneNumberId);
          console.log('WhatsApp message send result:', JSON.stringify(result, null, 2));
        }

        // Always return a 200 status to the webhook to prevent retries
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (processError) {
        console.error('Error in message processing:', processError);
        
        // Send error message to user
        const errorResponse = {
          type: 'text',
          message: "I'm sorry, but I encountered an error while processing your message. Please try again with a simpler query or try one of our basic commands like 'events' or 'help'."
        };
        
        try {
          await sendWhatsAppMessage(message.from, errorResponse, phoneNumberId);
        } catch (sendError) {
          console.error('Error sending error message:', sendError);
        }
        
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Still return 200 to prevent webhook retries
        });
      }
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Webhook handler error:', {
      message: error.message,
      stack: error.stack
    });
    return new Response(JSON.stringify({ 
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 200, // Return 200 even for errors to prevent webhook retries
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
