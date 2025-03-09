
const whatsappToken = Deno.env.get('WHATSAPP_TOKEN');
const whatsappPhoneNumberId = '110903815329534'; // Replace with your WhatsApp Phone Number ID

export const sendWhatsAppMessage = async (to: string, response: any) => {
  try {
    console.log('Sending message to:', to);
    const url = `https://graph.facebook.com/v17.0/${whatsappPhoneNumberId}/messages`;
    
    // Prepare the message based on the response type
    let message;
    
    if (response.type === 'text') {
      message = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: false,
          body: response.message
        }
      };
    } else if (response.type === 'interactive' && response.interactive) {
      message = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'interactive',
        interactive: response.interactive
      };
    } else {
      throw new Error('Unsupported message format');
    }
    
    console.log('Sending WhatsApp message payload:', JSON.stringify(message, null, 2));
    
    const sendResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
    
    if (!sendResponse.ok) {
      const errorData = await sendResponse.text();
      console.error('WhatsApp API error:', {
        status: sendResponse.status,
        statusText: sendResponse.statusText,
        data: errorData
      });
      throw new Error(`WhatsApp API error: ${sendResponse.status} ${sendResponse.statusText}`);
    }
    
    const responseData = await sendResponse.json();
    console.log('Message sent successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};
