
import { useState } from "react";
import { ChatMessage, PendingAction } from "@/types/chat";

interface UseChatMessageHandlerProps {
  contextData?: any;
  inputValue?: string;
  isLoading?: boolean;
  setInputValue?: (value: string) => void;
  clearInput?: () => void;
  forceLocalData?: boolean;
}

export const useChatMessageHandler = ({
  contextData,
  inputValue: externalInputValue = "",
  isLoading: externalIsLoading = false,
  setInputValue: externalSetInputValue = () => {},
  clearInput: externalClearInput = () => {},
  forceLocalData = true
}: UseChatMessageHandlerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!externalInputValue.trim() || isLoading) {
      return;
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: externalInputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    externalSetInputValue("");
    setIsLoading(true);
    
    // Simplified response (replacing AI functionality)
    setTimeout(() => {
      const systemResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "AI functionality has been removed from this application.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemResponse]);
      setIsLoading(false);
      externalClearInput();
    }, 500);
  };

  return {
    messages,
    isLoading,
    pendingAction,
    handleSubmit
  };
};
