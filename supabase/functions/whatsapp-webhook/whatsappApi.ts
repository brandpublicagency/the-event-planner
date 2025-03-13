
import { corsHeaders } from '../_shared/cors.ts';
import { WhatsAppResponse } from './utils/timeoutUtils.ts';

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const BASE_URL = 'https://graph.facebook.com/v18.0/';

export async function sendWhatsAppMessage(
  recipientPhone: string, 
  response: WhatsAppResponse, 
  phoneNumberId: string
): Promise<any> {
  if (!WHATSAPP_TOKEN) {
    console.error('Missing WHATSAPP_TOKEN environment variable');
    throw new Error('Missing WHATSAPP_TOKEN');
  }

  let payload;
  try {
    // Create the proper message payload based on the response type
    payload = createMessagePayload(recipientPhone, response);
    console.log('Creating message payload from response:', JSON.stringify(response, null, 2));
    console.log('Sending message to:', recipientPhone);
  } catch (error) {
    console.error('Error creating message payload:', error);
    // Try to send a fallback text message
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipientPhone,
      type: 'text',
      text: {
        body: "I'm having trouble processing your request. Please try again or type 'help' for available commands."
      }
    };
  }

  try {
    // Send the message using the WhatsApp Business API
    const url = `${BASE_URL}${phoneNumberId}/messages`;
    console.log('Sending WhatsApp message to URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        ...corsHeaders
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WhatsApp API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('WhatsApp API response:', JSON.stringify(responseData, null, 2));
    return responseData;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

// Helper function to create the message payload based on the response type
function createMessagePayload(recipientPhone: string, response: WhatsAppResponse): any {
  const basePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipientPhone
  };

  switch (response.type) {
    case 'text':
      return {
        ...basePayload,
        type: 'text',
        text: {
          body: response.message || "Sorry, I don't have a response for that."
        }
      };

    case 'interactive':
      if (!response.interactive) {
        throw new Error('Interactive response missing interactive property');
      }
      return {
        ...basePayload,
        type: 'interactive',
        interactive: response.interactive
      };

    default:
      console.error('Unsupported response type:', response.type);
      return {
        ...basePayload,
        type: 'text',
        text: {
          body: "I don't know how to respond to that. Please try something else or type 'help'."
        }
      };
  }
}
