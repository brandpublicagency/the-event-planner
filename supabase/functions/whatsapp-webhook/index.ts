
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
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      console.log('Webhook verification:', { mode, token, challenge });

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified successfully');
        return new Response(challenge, { headers: corsHeaders });
      }
      console.error('Failed webhook verification:', { mode, token });
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      console.log('Webhook payload received:', JSON.stringify(body, null, 2));
      
      const entry = body.entry?.[0];
      if (!entry) {
        console.error('Invalid webhook format: missing entry');
        return new Response(JSON.stringify({ status: 'error', message: 'Invalid webhook format' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const changes = entry.changes?.[0];
      if (!changes) {
        console.error('Invalid webhook format: missing changes');
        return new Response(JSON.stringify({ status: 'error', message: 'Invalid webhook format' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const value = changes.value;
      if (!value) {
        console.error('Invalid webhook format: missing value');
        return new Response(JSON.stringify({ status: 'error', message: 'Invalid webhook format' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      const messages = value.messages;
      if (!messages?.length) {
        console.log('No messages in webhook payload - likely a status update');
        return new Response(JSON.stringify({ status: 'no messages' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const message = messages[0];
      if (!message?.from) {
        console.error('Invalid message format - missing from field:', message);
        throw new Error('Invalid message format - missing from field');
      }

      console.log('Processing message from:', message.from);
      const response = await handleMessage(message);
      console.log('Generated response:', JSON.stringify(response, null, 2));

      if (!response) {
        console.error('No response generated from handleMessage');
        throw new Error('No response generated');
      }

      // Send the response to WhatsApp
      const result = await sendWhatsAppMessage(message.from, response);
      console.log('Message send result:', JSON.stringify(result, null, 2));

      // Even if the message fails to send to WhatsApp, we should return success to the webhook
      // to prevent retries that might not help
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
