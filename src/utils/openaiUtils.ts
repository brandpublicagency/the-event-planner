// This is a placeholder file to replace the original OpenAI utils
// Original functionality has been removed

import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const TIMEOUT_DURATION = 30000; 

export const handleOpenAIRequest = async (
  messages: ChatCompletionMessageParam[],
  onTimeout: () => void
) => {
  console.log("OpenAI functionality has been removed");
  return null;
};

export const prepareOpenAIMessages = (
  systemMessage: string,
  chatMessages: { text: string; isUser: boolean }[],
  currentInput: string
): ChatCompletionMessageParam[] => {
  console.log("OpenAI functionality has been removed");
  return [];
};
