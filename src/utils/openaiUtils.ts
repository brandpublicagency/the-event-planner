import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getChatCompletion } from "@/services/openai";

export const TIMEOUT_DURATION = 45000;

export const handleOpenAIRequest = async (
  messages: ChatCompletionMessageParam[],
  onTimeout: () => void
) => {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out. Please try a shorter message or try again later."));
    }, TIMEOUT_DURATION);
  });

  try {
    const response = await Promise.race([
      getChatCompletion(messages),
      timeoutPromise
    ]);

    return response;
  } catch (error) {
    if (error.message.includes("timeout")) {
      onTimeout();
    }
    throw error;
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