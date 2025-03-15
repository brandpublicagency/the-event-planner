
import { ReactNode } from "react";
import { useChatMessageHandler } from "@/hooks/chat/useChatMessageHandler";
import { ChatMessage, PendingAction } from "@/types/chat";

interface ChatMessageHandlerProps {
  children: (props: {
    messages: ChatMessage[];
    isLoading: boolean;
    pendingAction: PendingAction | null;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => ReactNode;
  contextData?: any;
  inputValue?: string;
  isLoading?: boolean;
  setInputValue?: (value: string) => void;
  clearInput?: () => void;
  forceLocalData?: boolean;
}

const ChatMessageHandler = ({ 
  children, 
  contextData, 
  inputValue = "",
  isLoading = false,
  setInputValue = () => {},
  clearInput = () => {},
  forceLocalData = false
}: ChatMessageHandlerProps) => {
  const {
    messages,
    isLoading: handlerIsLoading,
    pendingAction,
    handleSubmit
  } = useChatMessageHandler({
    contextData,
    inputValue,
    isLoading,
    setInputValue,
    clearInput,
    forceLocalData
  });

  // Ensure messages are passed correctly to children
  return children({
    messages,
    isLoading: handlerIsLoading,
    pendingAction,
    handleSubmit
  });
};

export default ChatMessageHandler;
