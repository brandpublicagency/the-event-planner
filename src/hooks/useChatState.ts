import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { ChatMessage, PendingAction } from "@/types/chat";

export const useChatState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const { toast } = useToast();

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const addSystemMessage = (text: string) => {
    addMessage({ text, isUser: false });
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, isUser: true });
  };

  const clearInput = () => {
    setInputValue("");
  };

  return {
    messages,
    inputValue,
    isLoading,
    pendingAction,
    setInputValue,
    setIsLoading,
    setPendingAction,
    addMessage,
    addSystemMessage,
    addUserMessage,
    clearInput,
    toast
  };
};