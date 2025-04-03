
// This file replaces the original chatStream.ts with simplified functionality

export type StreamProcessor = {
  onContent: (content: string) => void;
  onFunctionCall: (functionCall: { name: string; arguments: string }) => void;
  onError: (error: string) => void;
  onComplete: () => void;
}

export const streamChatCompletion = async (
  messages: any[],
  systemMessage: string,
  processor: StreamProcessor,
  functionDefs?: any[]
) => {
  console.log("Chat streaming functionality has been removed");
  processor.onError("Chat AI functionality has been removed");
};

export const getChatFunctionDefinitions = () => {
  return [];
};
