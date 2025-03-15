
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useMessageProcessor } from './MessageProcessor';

interface WhatsAppMessageHandlerProps {
  onSetIsLoading: (loading: boolean) => void;
  onAddSystemMessage: (message: string, messageId?: string) => void;
  onSetPendingAction: (action: any | null) => void;
  onClearInput: () => void;
}

export const useWhatsAppMessageHandler = ({
  onSetIsLoading,
  onAddSystemMessage,
  onSetPendingAction,
  onClearInput
}: WhatsAppMessageHandlerProps) => {
  const { tempMessageId, setTempMessageId, processAIResponse } = useMessageProcessor({
    onSetIsLoading,
    onAddSystemMessage,
    onSetPendingAction,
    onClearInput
  });

  const fetchWhatsAppResponse = useCallback(async (userMessage: string) => {
    onSetIsLoading(true);
    
    // Add a temporary message that will be replaced with the actual response
    const temporaryId = Date.now().toString();
    setTempMessageId(temporaryId);
    onAddSystemMessage("Processing...", temporaryId);
    
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-webhook-direct', {
        body: { message: userMessage },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.message) {
        // Process the response through our message processor
        await processAIResponse(data.message);
      } else {
        throw new Error('No message in response');
      }
    } catch (error) {
      console.error('Error fetching WhatsApp response:', error);
      
      // Replace the temporary message with an error message
      onAddSystemMessage(
        "I'm having trouble processing your request. Please try again later.",
        temporaryId
      );
      setTempMessageId(null);
      onSetIsLoading(false);
    }
  }, [onSetIsLoading, onAddSystemMessage, processAIResponse, setTempMessageId]);

  return { fetchWhatsAppResponse };
};
