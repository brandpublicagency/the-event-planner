import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage, PendingAction } from "@/types/chat";

const CHAT_STORAGE_KEY = 'chat_messages';
const LAST_ACTIVITY_KEY = 'chat_last_activity';
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes in milliseconds

export const useChatState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
      const storedMessages = sessionStorage.getItem(CHAT_STORAGE_KEY);
      
      if (lastActivity && storedMessages) {
        const lastActivityTime = parseInt(lastActivity, 10);
        const now = Date.now();
        
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

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase.channel('chat-updates')
      .on(
        'broadcast',
        { event: 'new-message' },
        (payload) => {
          console.log('Received real-time message:', payload);
          if (payload.payload) {
            setMessages(prev => [...prev, payload.payload as ChatMessage]);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addMessage = useCallback(async (message: ChatMessage) => {
    console.log('Adding message:', message);
    
    // Update local state
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, message];
      try {
        sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
        sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      } catch (error) {
        console.error('Error saving chat messages:', error);
      }
      return newMessages;
    });

    // Broadcast the message to all connected clients
    try {
      await supabase.channel('chat-updates').send({
        type: 'broadcast',
        event: 'new-message',
        payload: message,
      });
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  }, []);

  const addSystemMessage = useCallback((text: string) => {
    console.log('Adding system message:', text);
    addMessage({ text, isUser: false });
  }, [addMessage]);

  const addUserMessage = useCallback((text: string) => {
    console.log('Adding user message:', text);
    addMessage({ text, isUser: true });
  }, [addMessage]);

  const clearInput = useCallback(() => {
    setInputValue("");
  }, []);

  // Update last activity
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