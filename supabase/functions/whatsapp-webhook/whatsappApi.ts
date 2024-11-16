const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const PHONE_NUMBER_ID = '494335320427022';

export async function sendWhatsAppMessage(to: string, messageData: { type: 'text' | 'interactive', message?: string, interactive?: any }) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  
  try {
    console.log('Preparing WhatsApp message:', { to, messageData });
    
    let messageBody: any;
    
    if (messageData.type === 'interactive' && messageData.interactive) {
      messageBody = {
        messaging_product: "whatsapp",
        to: to,
        type: "interactive",
        interactive: messageData.interactive
      };
    } else {
      messageBody = {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
          body: messageData.message
        }
      };
    }

    console.log('Sending request to WhatsApp API:', JSON.stringify(messageBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    });

    const responseData = await response.json();
    console.log('WhatsApp API response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}