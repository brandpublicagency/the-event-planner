
import { PendingAction } from "@/types/chat";
import { identifyActionFromAI } from "@/utils/chatActionParser";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppMessageHandlerProps {
  onSetIsLoading: (loading: boolean) => void;
  onAddSystemMessage: (message: string, messageId?: string) => void;
  onSetPendingAction: (action: PendingAction | null) => void;
  onClearInput: () => void;
  contextData?: any;
}

export const useWhatsAppMessageHandler = ({
  onSetIsLoading,
  onAddSystemMessage,
  onSetPendingAction,
  onClearInput,
  contextData
}: WhatsAppMessageHandlerProps) => {
  
  const fetchWhatsAppResponse = async (inputText: string, messageId?: string) => {
    try {
      console.log('Invoking WhatsApp Webhook with:', inputText);
      
      // Invoke the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('whatsapp-webhook', {
        body: {
          type: 'text',
          text: { body: inputText },
          from: 'web-user'
        }
      });
      
      if (error) {
        console.error('Error invoking WhatsApp webhook:', error);
        throw error;
      }
      
      if (!data) {
        console.error('Empty response from WhatsApp webhook');
        throw new Error('Empty response from WhatsApp webhook');
      }
      
      console.log('WhatsApp webhook response:', data);
      
      // Extract message content
      const responseMessage = data.message || 'Sorry, I could not process your request.';
      
      // Check for potential action data in the response
      const pendingAction = identifyActionFromAI(responseMessage);
      
      // Remove action JSON from the display message if present
      let displayMessage = responseMessage;
      if (pendingAction) {
        const jsonPattern = /```json\s*({[\s\S]*?})\s*```/;
        displayMessage = displayMessage.replace(jsonPattern, '');
        // Clean up any double newlines or trailing whitespace
        displayMessage = displayMessage.replace(/\n{3,}/g, '\n\n').trim();
      }
      
      // Display the response message
      if (messageId) {
        onAddSystemMessage(displayMessage, messageId);
      } else {
        onAddSystemMessage(displayMessage);
      }
      
      // If there's an action, set it up as a pending action
      if (pendingAction) {
        console.log('Pending action identified in WhatsApp response:', pendingAction);
        
        // Add a separate confirmation message
        onAddSystemMessage(
          pendingAction.confirmationMessage || 
          "I'll need your confirmation to proceed with this action. Type 'yes' to confirm or 'no' to cancel."
        );
        onSetPendingAction(pendingAction);
      }
      
      // Reset state
      onSetIsLoading(false);
      onClearInput();
      
      return responseMessage;
    } catch (error: any) {
      console.error('Error in WhatsApp response:', error);
      
      // Show error message if a message ID was provided
      if (messageId) {
        onAddSystemMessage("I'm having trouble connecting to the messaging service. Please try again later.", messageId);
      } else {
        onAddSystemMessage("I'm having trouble connecting to the messaging service. Please try again later.");
      }
      
      // Reset state
      onSetIsLoading(false);
      onClearInput();
      
      throw new Error('WhatsApp API error: ' + (error.message || ''));
    }
  };
  
  return { fetchWhatsAppResponse };
};
