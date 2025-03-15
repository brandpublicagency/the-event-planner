
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getChatCompletion } from "@/services/openai";

export const TIMEOUT_DURATION = 30000; // Increased timeout for reliability

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
    console.log(`Starting OpenAI request with ${messages.length} messages`);
    
    // Track the start time for performance monitoring
    const startTime = performance.now();
    
    const response = await Promise.race([
      getChatCompletion(messages),
      timeoutPromise
    ]);

    // Log performance metrics
    const endTime = performance.now();
    console.log(`OpenAI request completed in ${(endTime - startTime).toFixed(0)}ms`);

    if (!response) {
      console.warn('Empty response from OpenAI, triggering fallback');
      onTimeout();
      return null;
    }

    return response;
  } catch (error: any) {
    console.error('Error in OpenAI request:', error.message);
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
  // Log the system message length for monitoring
  console.log(`Preparing system message of length: ${systemMessage.length}`);
  
  // Create system message
  const systemMessageObj: ChatCompletionMessageParam = {
    role: "system",
    content: systemMessage
  };

  // Convert chat history to OpenAI format
  const userMessages: ChatCompletionMessageParam[] = chatMessages.map(msg => ({
    role: msg.isUser ? "user" : "assistant",
    content: msg.text
  }));

  // Add current user input
  const currentMessage: ChatCompletionMessageParam = {
    role: "user",
    content: currentInput
  };

  // Return complete message array
  return [systemMessageObj, ...userMessages, currentMessage];
};
