
import { ChatMessage } from "@/types/chat";
import { StreamProcessor } from "@/services/chatStream";

export const streamChatRequest = async (
  messages: ChatMessage[],
  systemMessage: string,
  processor: StreamProcessor,
  functionDefs?: any[]
) => {
  console.log("Streaming chat functionality has been removed");
  processor.onError("AI streaming functionality has been removed");
};
