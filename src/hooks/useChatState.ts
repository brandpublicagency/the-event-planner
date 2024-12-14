import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { ChatMessage, PendingAction } from "@/types/chat";

const CHAT_STORAGE_KEY = 'chat_messages';
const LAST_ACTIVITY_KEY = 'chat_last_activity';
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes in milliseconds

export const useChatState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initialize from session storage if available
    try {
      const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
      const storedMessages = sessionStorage.getItem(CHAT_STORAGE_KEY);
      
      if (lastActivity && storedMessages) {
        const lastActivityTime = parseInt(lastActivity, 10);
        const now = Date.now();
        
        // Check if session has expired (60 minutes of inactivity)
        if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
          sessionStorage.removeItem(CHAT_STORAGE_KEY);
          sessionStorage.removeItem(LAST_ACTIVITY_KEY);
          return [];
        }
        
        return JSON.parse(storedMessages);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
    return [];
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const { toast } = useToast();

  // Update session storage whenever messages change
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  }, [messages]);

  // Update last activity timestamp on user interaction
  useEffect(() => {
    const updateLastActivity = () => {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    };

    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('click', updateLastActivity);

    return () => {
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('click', updateLastActivity);
    };
  }, []);

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