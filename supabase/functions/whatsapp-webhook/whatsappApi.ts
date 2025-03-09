
const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const PHONE_NUMBER_ID = '494335320427022';

export async function sendWhatsAppMessage(to: string, messageData: { type: 'text' | 'interactive', message?: string, interactive?: any }) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  
  try {
    console.log('Preparing WhatsApp message:', {
      to,
      type: messageData.type,
      hasInteractive: !!messageData.interactive,
      hasMessage: !!messageData.message,
      messageData: JSON.stringify(messageData, null, 2)
    });
    
    const messageBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: messageData.type,
      ...(messageData.type === 'interactive' 
        ? { interactive: messageData.interactive }
        : { text: { preview_url: false, body: messageData.message || 'No message content' } }
      )
    };

    console.log('WhatsApp API request:', JSON.stringify(messageBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error('WhatsApp API error response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      throw new Error(`WhatsApp API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    const responseData = await response.json();
    console.log('WhatsApp API success response:', {
      status: response.status,
      data: responseData
    });

    return responseData;
  } catch (error) {
    console.error('WhatsApp message error:', {
      error: error.message,
      stack: error.stack,
      to,
      messageType: messageData.type
    });
    throw error;
  }
}
