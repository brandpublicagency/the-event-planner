
import { ChatMessage } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { StreamProcessor } from "@/services/chatStream";

/**
 * Streams a chat completion from the edge function with improved error handling
 */
export const streamChatRequest = async (
  messages: ChatMessage[],
  systemMessage: string,
  processor: StreamProcessor,
  functionDefs?: any[]
) => {
  try {
    console.log(`Streaming chat request with ${messages.length} messages`);
    
    // Prepare messages for the AI
    const formattedMessages = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Call our edge function
    const { data, error } = await supabase.functions.invoke("chat-stream", {
      body: { 
        messages: formattedMessages, 
        systemMessage, 
        functionDefs 
      }
    });

    if (error) {
      console.error('Error calling chat-stream edge function:', error);
      processor.onError(`Error streaming response: ${error.message}`);
      return;
    }

    if (!data) {
      processor.onError("No data received from streaming endpoint");
      return;
    }

    // Process the response data
    if (data.content) {
      processor.onContent(data.content);
    }
    
    if (data.function_call) {
      processor.onFunctionCall(data.function_call);
    }
    
    processor.onComplete();
  } catch (error) {
    console.error('Error in streamChatCompletion:', error);
    processor.onError(`Streaming error: ${error.message}`);
  }
};
