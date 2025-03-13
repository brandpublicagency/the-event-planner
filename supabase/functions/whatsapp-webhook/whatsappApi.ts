
const whatsappToken = Deno.env.get('WHATSAPP_TOKEN');

/**
 * Sends a message to a WhatsApp user
 * 
 * @param to The recipient's phone number
 * @param response The message payload to send
 * @param phoneNumberId The WhatsApp phone number ID to send from
 * @returns The response from the WhatsApp API
 */
export const sendWhatsAppMessage = async (to: string, response: any, phoneNumberId: string) => {
  try {
    console.log('Preparing to send message to:', to);
    
    if (!whatsappToken) {
      console.error('WhatsApp token is missing');
      throw new Error('WhatsApp token is missing');
    }
    
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    // Validate and sanitize phone number - must be in format: country code + number
    const sanitizedTo = sanitizePhoneNumber(to);
    if (!sanitizedTo) {
      console.error('Invalid phone number:', to);
      throw new Error('Invalid phone number format');
    }
    
    // Prepare the message based on the response type
    let message = createWhatsAppMessagePayload(sanitizedTo, response);
    
    console.log('Sending WhatsApp message type:', message.type);
    
    // Add a retry mechanism
    const maxRetries = 2;
    let retries = 0;
    let error = null;
    
    while (retries <= maxRetries) {
      try {
        const sendResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        });
        
        // Parse the response carefully
        let responseData;
        try {
          const responseText = await sendResponse.text();
          responseData = responseText ? JSON.parse(responseText) : {};
          console.log('WhatsApp API response:', JSON.stringify(responseData, null, 2));
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
          responseData = { error: 'Invalid response' };
        }
        
        if (sendResponse.ok) {
          console.log('Message sent successfully:', 
            responseData.messages?.[0]?.id || 'No message ID returned');
          return { success: true, data: responseData };
        } else {
          error = {
            status: sendResponse.status,
            statusText: sendResponse.statusText,
            data: responseData
          };
          
          console.error(`WhatsApp API error (Attempt ${retries + 1}/${maxRetries + 1}):`, error);
          
          // If we're on the final retry, try a fallback message
          if (retries === maxRetries) {
            // Try to send a simplified fallback message if the original was complex
            if (message.type !== 'text' || (response.message && response.message.length > 500)) {
              const success = await sendFallbackMessage(url, sanitizedTo, whatsappToken);
              if (success) {
                return { 
                  success: false, 
                  error: error,
                  fallbackSent: true
                };
              }
            }
            
            throw new Error(`WhatsApp API error: ${sendResponse.status} ${sendResponse.statusText}`);
          }
        }
      } catch (fetchError) {
        console.error(`Network error on attempt ${retries + 1}/${maxRetries + 1}:`, fetchError);
        error = fetchError;
        
        if (retries === maxRetries) {
          break;
        }
      }
      
      retries++;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
    
    throw error || new Error('Failed to send message after multiple attempts');
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

/**
 * Creates a properly formatted WhatsApp message payload
 */
function createWhatsAppMessagePayload(to: string, response: any) {
  console.log('Creating message payload from response:', JSON.stringify(response, null, 2));
  
  if (response.type === 'text') {
    // Ensure the message text isn't too long for WhatsApp
    const messageText = truncateMessage(response.message || "Sorry, I couldn't process your request.");
    
    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body: messageText
      }
    };
  } else if (response.type === 'interactive' && response.interactive) {
    // Validate interactive message for WhatsApp requirements
    const sanitizedInteractive = sanitizeInteractiveMessage(response.interactive);
    
    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive: sanitizedInteractive
    };
  } else {
    console.warn('Unsupported message format, defaulting to text:', response);
    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body: "I received your message but couldn't format my response correctly. Please try again."
      }
    };
  }
}

/**
 * Truncates a message to fit WhatsApp's limits
 */
function truncateMessage(text: string): string {
  const MAX_LENGTH = 4096; // WhatsApp's limit
  if (!text || text.length <= MAX_LENGTH) return text || "No message content";
  
  return text.substring(0, MAX_LENGTH - 3) + '...';
}

/**
 * Sanitizes a phone number for WhatsApp API
 */
function sanitizePhoneNumber(phone: string): string {
  // Check if null or undefined
  if (!phone) return '';
  
  // Remove any non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Ensure it has a country code
  if (cleaned.length < 10) return '';
  
  return cleaned;
}

/**
 * Sanitizes an interactive message to comply with WhatsApp API requirements
 */
function sanitizeInteractiveMessage(interactive: any): any {
  try {
    if (!interactive) {
      return {
        type: 'button',
        body: {
          text: "Error: Missing interactive content"
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'error',
                title: 'Try Again'
              }
            }
          ]
        }
      };
    }
    
    // Deep clone to avoid modifying original
    const sanitized = JSON.parse(JSON.stringify(interactive));
    
    // Ensure body text isn't too long
    if (sanitized.body?.text) {
      sanitized.body.text = truncateMessage(sanitized.body.text);
    }
    
    // For list messages, ensure sections and rows are valid
    if (sanitized.type === 'list') {
      // Ensure there aren't too many sections (max 10)
      if (sanitized.action?.sections && sanitized.action.sections.length > 10) {
        sanitized.action.sections = sanitized.action.sections.slice(0, 10);
      }
      
      // Ensure button text isn't too long (max 20 chars)
      if (sanitized.action?.button && sanitized.action.button.length > 20) {
        sanitized.action.button = sanitized.action.button.substring(0, 20);
      }
      
      // Process sections to ensure they're valid
      if (sanitized.action?.sections) {
        sanitized.action.sections.forEach((section: any) => {
          // Ensure section title isn't too long (max 24 chars)
          if (section.title && section.title.length > 24) {
            section.title = section.title.substring(0, 24);
          }
          
          // Ensure rows are valid
          if (section.rows && section.rows.length > 10) {
            section.rows = section.rows.slice(0, 10);
          }
          
          // Ensure row titles aren't too long (max 24 chars)
          if (section.rows) {
            section.rows.forEach((row: any) => {
              if (row.title && row.title.length > 24) {
                row.title = row.title.substring(0, 24);
              }
              
              // Ensure row descriptions aren't too long (max 72 chars)
              if (row.description && row.description.length > 72) {
                row.description = row.description.substring(0, 72);
              }
            });
          }
        });
      }
    }
    
    return sanitized;
  } catch (error) {
    console.error('Error sanitizing interactive message:', error);
    // Return a safe fallback
    return {
      type: 'button',
      body: {
        text: "I encountered an error processing your request."
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'error',
              title: 'Try Again'
            }
          }
        ]
      }
    };
  }
}

/**
 * Sends a fallback message when the main message fails
 */
async function sendFallbackMessage(url: string, to: string, token: string): Promise<boolean> {
  try {
    console.log('Sending simplified fallback message');
    const fallbackMessage = "I'm sorry, I'm having trouble responding right now. Please try again with a simpler request.";
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: false,
          body: fallbackMessage
        }
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending fallback message:', error);
    return false;
  }
}
