import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getChatCompletion } from "@/services/openai";

export const TIMEOUT_DURATION = 30000; // Reduced from 45000 for faster fallback

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
    // Add logging for debugging
    console.log(`Sending OpenAI request with ${messages.length} messages`);
    
    const response = await Promise.race([
      getChatCompletion(messages),
      timeoutPromise
    ]);

    if (!response) {
      console.warn('Empty response from OpenAI, triggering fallback');
      onTimeout();
      return null;
    }

    return response;
  } catch (error: any) {
    console.error('Error in OpenAI request:', error.message);
    if (error.message.includes("timeout") || error.message.includes("timed out")) {
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
