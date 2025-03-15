
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getChatCompletion } from "@/services/openai";

export const TIMEOUT_DURATION = 25000; // Optimized timeout for GPT-4o

export const handleOpenAIRequest = async (
  messages: ChatCompletionMessageParam[],
  onTimeout: () => void
) => {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out. Using fallback response mechanism."));
    }, TIMEOUT_DURATION);
  });

  try {
    // Enhanced logging for debugging
    console.log(`Sending OpenAI GPT-4o request with ${messages.length} messages`);
    console.log(`System message length: ${
      messages.find(m => m.role === 'system')?.content?.toString().length || 0
    } characters`);
    
    const response = await Promise.race([
      getChatCompletion(messages),
      timeoutPromise
    ]);

    if (!response) {
      console.warn('Empty response from OpenAI GPT-4o, triggering fallback');
      onTimeout();
      return null;
    }

    return response;
  } catch (error: any) {
    console.error('Error in OpenAI GPT-4o request:', error.message);
    if (error.message.includes("timeout") || error.message.includes("timed out")) {
      console.log('Timeout detected, triggering fallback');
      onTimeout();
    }
    return null; // Return null to trigger fallback in calling code
  }
};

export const prepareOpenAIMessages = (
  systemMessage: string,
  chatMessages: { text: string; isUser: boolean }[],
  currentInput: string
): ChatCompletionMessageParam[] => {
  // Log the system message length for debugging
  console.log(`Preparing system message of length: ${systemMessage.length}`);
  
  const systemMessageObj: ChatCompletionMessageParam = {
    role: "system",
    content: systemMessage
  };

  const userMessages: ChatCompletionMessageParam[] = chatMessages.map(msg => ({
    role: msg.isUser ? "user" : "assistant",
    content: msg.text
  }));

  const currentMessage: ChatCompletionMessageParam = {
    role: "user",
    content: currentInput
  };

  return [systemMessageObj, ...userMessages, currentMessage];
};
