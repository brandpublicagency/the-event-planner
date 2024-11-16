const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const PHONE_NUMBER_ID = '494335320427022';

export async function sendWhatsAppMessage(to: string, messageData: { message: string, components?: any[] }) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  
  try {
    console.log('Sending WhatsApp message:', { to, messageData });
    
    const messageBody: any = {
      messaging_product: "whatsapp",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: messageData.message
        },
        action: {
          buttons: messageData.components?.map(component => ({
            type: component.sub_type,
            text: component.parameters[0].text,
            url: component.url
          })) || []
        }
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    });

    const responseData = await response.json();
    console.log('WhatsApp API response:', responseData);

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}