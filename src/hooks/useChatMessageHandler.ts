
// This is a simplified implementation that doesn't use OpenAI or WhatsApp

import { useState } from "react";
import { ChatMessage } from "@/types/chat";

interface UseChatMessageHandlerProps {
  inputValue?: string;
  setInputValue?: (value: string) => void;
  clearInput?: () => void;
}

export const useChatMessageHandler = ({
  inputValue: externalInputValue = "",
  setInputValue: externalSetInputValue = () => {},
  clearInput: externalClearInput = () => {}
}: UseChatMessageHandlerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Simple placeholder response
    setTimeout(() => {
      const systemResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "This is a placeholder response. Chat functionality has been removed.",
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
    pendingAction: null,
    handleSubmit
  };
};
