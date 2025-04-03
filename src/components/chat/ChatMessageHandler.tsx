
import { ReactNode } from "react";
import { ChatMessage } from "@/types/chat";

interface ChatMessageHandlerProps {
  children: (props: {
    messages: ChatMessage[];
    isLoading: boolean;
    pendingAction: null;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => ReactNode;
}

const ChatMessageHandler = ({ children }: ChatMessageHandlerProps) => {
  // This is a simplified implementation that doesn't use OpenAI
  const messages: ChatMessage[] = [];
  const isLoading = false;
  const pendingAction = null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Chat functionality has been simplified - AI integration removed");
  };

  return children({
    messages,
    isLoading,
    pendingAction,
    handleSubmit
  });
};

export default ChatMessageHandler;
