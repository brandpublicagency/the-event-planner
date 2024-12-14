import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleMessage } from './handlers/messageHandler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VERIFY_TOKEN = Deno.env.get('VERIFY_TOKEN');
const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const PHONE_NUMBER_ID = '494335320427022';

async function sendWhatsAppMessage(to: string, messageData: any) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  
  try {
    console.log('Preparing WhatsApp message:', {
      to,
      messageData: JSON.stringify(messageData, null, 2)
    });

    const messageBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: messageData.type,
      ...(messageData.type === 'interactive' 
        ? { interactive: messageData.interactive }
        : { text: { preview_url: false, body: messageData.message } }
      )
    };

    console.log('Sending WhatsApp API request:', JSON.stringify(messageBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WhatsApp API error:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(`WhatsApp API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    console.log('WhatsApp API success response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending WhatsApp message:', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

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
        return new Response(challenge, { headers: corsHeaders });
      }
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      console.log('Webhook body received:', JSON.stringify(body, null, 2));
      
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (!messages?.length) {
        console.log('No messages in webhook payload');
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

      await sendWhatsAppMessage(message.from, response);
      console.log('Message sent successfully');

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