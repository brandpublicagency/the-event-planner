
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

type SavedChatMessage = {
  id: string;
  message_id: string;
  conversation_id: string;
  created_at: string;
  content: string;
  is_user: boolean;
}

export function useChatHistory() {
  const queryClient = useQueryClient();
  const conversationId = localStorage.getItem('conversation_id') || createNewConversation();
  
  // Create a new conversation ID and save it
  function createNewConversation() {
    const newId = uuidv4();
    localStorage.setItem('conversation_id', newId);
    return newId;
  }
  
  // Reset the conversation
  const resetConversation = useCallback(() => {
    createNewConversation();
    queryClient.invalidateQueries({ queryKey: ['chat-history'] });
  }, [queryClient]);
  
  // Fetch chat history
  const { data: chatHistory, isLoading } = useQuery({
    queryKey: ['chat-history', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }
      
      return (data || []).map((msg: SavedChatMessage): ChatMessage => ({
        id: msg.message_id,
        text: msg.content,
        isUser: msg.is_user
      }));
    },
    staleTime: 30000
  });
  
  // Save a message to history
  const { mutate: saveMessage } = useMutation({
    mutationFn: async (message: ChatMessage) => {
      // Don't save thinking/loading messages
      if (message.text === "Thinking..." || 
          message.text === "Processing..." ||
          message.text.includes("Retrying...")) {
        return;
      }
      
      const { error } = await supabase
        .from('chat_history')
        .insert({
          message_id: message.id,
          conversation_id: conversationId,
          content: message.text,
          is_user: message.isUser
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', conversationId] });
    }
  });
  
  return {
    chatHistory: chatHistory || [], 
    isLoading,
    saveMessage,
    resetConversation,
    conversationId
  };
}
