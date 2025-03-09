
const whatsappToken = Deno.env.get('WHATSAPP_TOKEN');
const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') || '110903815329534'; // Get dynamic ID or use fallback

export const sendWhatsAppMessage = async (to: string, response: any) => {
  try {
    console.log('Preparing to send message to:', to);
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`; // Updated to v18.0
    
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
      console.error('Unsupported message format:', response);
      throw new Error('Unsupported message format');
    }
    
    console.log('Sending WhatsApp message payload:', JSON.stringify(message, null, 2));
    
    // Add a retry mechanism
    const maxRetries = 2;
    let retries = 0;
    let sendResponse;
    
    while (retries <= maxRetries) {
      try {
        if (!whatsappToken) {
          console.error('WhatsApp token is missing');
          throw new Error('WhatsApp token is missing');
        }
        
        sendResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        });
        
        if (sendResponse.ok) {
          break;
        } else {
          const errorData = await sendResponse.text();
          console.error(`WhatsApp API error (Attempt ${retries + 1}/${maxRetries + 1}):`, {
            status: sendResponse.status,
            statusText: sendResponse.statusText,
            data: errorData,
            url: url,
            phoneNumberId: phoneNumberId
          });
          
          if (retries === maxRetries) {
            // If we're on the last retry and still failing, try sending a simplified fallback message
            if (response.type === 'text') {
              console.log('Sending simplified fallback message');
              const fallbackMessage = "I'm sorry, I'm having trouble responding right now. Please try again later.";
              return { 
                success: false, 
                error: errorData,
                fallbackSent: true,
                message: fallbackMessage
              };
            }
            throw new Error(`WhatsApp API error: ${sendResponse.status} ${sendResponse.statusText}`);
          }
        }
      } catch (error) {
        console.error(`Network error on attempt ${retries + 1}/${maxRetries + 1}:`, error);
        if (retries === maxRetries) {
          throw error;
        }
      }
      
      retries++;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
    
    if (!sendResponse || !sendResponse.ok) {
      throw new Error('Failed to send message after multiple attempts');
    }
    
    const responseData = await sendResponse.json();
    console.log('Message sent successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
