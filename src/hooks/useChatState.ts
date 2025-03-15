
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage, PendingAction } from "@/types/chat";
import { useChatHistory } from "./useChatHistory";

const CHAT_STORAGE_KEY = 'chat_messages';
const LAST_ACTIVITY_KEY = 'chat_last_activity';
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes in milliseconds

export const useChatState = () => {
  // Initialize with saved messages from session storage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
      const storedMessages = sessionStorage.getItem(CHAT_STORAGE_KEY);
      
      if (lastActivity && storedMessages) {
        const lastActivityTime = parseInt(lastActivity, 10);
        const now = Date.now();
        
        if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
          // Clear expired conversation
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
  
  // Get chat history functionality
  const { 
    chatHistory, 
    saveMessage, 
    resetConversation 
  } = useChatHistory();
  
  // Initialize messages from history if available
  useEffect(() => {
    if (chatHistory.length > 0 && messages.length === 0) {
      setMessages(chatHistory);
    }
  }, [chatHistory, messages.length]);

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

  // Manage conversation expiry - check every minute
  useEffect(() => {
    const checkExpiry = () => {
      const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivity) {
        const lastActivityTime = parseInt(lastActivity, 10);
        const now = Date.now();
        
        if (now - lastActivityTime > INACTIVITY_TIMEOUT) {
          console.log('Chat session expired due to inactivity, resetting...');
          setMessages([]);
          sessionStorage.removeItem(CHAT_STORAGE_KEY);
          sessionStorage.removeItem(LAST_ACTIVITY_KEY);
          resetConversation();
        }
      }
    };
    
    const interval = setInterval(checkExpiry, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [resetConversation]);

  const addMessage = useCallback(async (message: ChatMessage, messageId?: string) => {
    console.log('Adding message:', message, messageId ? `with ID: ${messageId}` : '');
    
    // Update local state
    setMessages(prevMessages => {
      let newMessages;
      
      if (messageId) {
        // If messageId is provided, replace the message with that ID
        const messageIndex = prevMessages.findIndex(msg => msg.id === messageId);
        if (messageIndex >= 0) {
          console.log(`Replacing message at index ${messageIndex}`);
          const updatedMessages = [...prevMessages];
          updatedMessages[messageIndex] = { ...message, id: messageId };
          newMessages = updatedMessages;
        } else {
          // If message with ID not found, add with that ID
          console.log(`Message with ID ${messageId} not found, adding as new`);
          newMessages = [...prevMessages, { ...message, id: messageId }];
        }
      } else {
        // Normal case - just append the message with a random ID
        const newMessageWithId = { ...message, id: Date.now().toString() };
        newMessages = [...prevMessages, newMessageWithId];
        
        // Save to persistent storage if it's not a temporary message
        if (message.text !== "Thinking..." && 
            message.text !== "Processing..." && 
            !message.text.includes("Retrying...")) {
          saveMessage(newMessageWithId);
        }
      }
      
      try {
        // Update session storage and last activity time
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
  }, [saveMessage]);

  const addSystemMessage = useCallback((text: string, messageId?: string) => {
    console.log('Adding system message:', text, messageId ? `with ID: ${messageId}` : '');
    addMessage({ text, isUser: false }, messageId);
  }, [addMessage]);

  const addUserMessage = useCallback((text: string) => {
    console.log('Adding user message:', text);
    addMessage({ text, isUser: true });
  }, [addMessage]);

  const clearInput = useCallback(() => {
    setInputValue("");
  }, []);
  
  const clearChat = useCallback(() => {
    setMessages([]);
    sessionStorage.removeItem(CHAT_STORAGE_KEY);
    resetConversation();
  }, [resetConversation]);

  // Update last activity when user interacts
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
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    pendingAction,
    setPendingAction,
    addSystemMessage,
    addUserMessage,
    clearInput,
    clearChat
  };
};
