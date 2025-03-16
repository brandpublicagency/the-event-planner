
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, SaveChatMessageParams, SavedChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to manage chat history persistence in Supabase
 */
export function useChatHistory(conversationId: string) {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load chat history from Supabase
  const loadChatHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use a typecast to handle the table not being in the TypeScript definitions
      // This is a workaround until the full database types are regenerated
      const { data, error } = await (supabase as any)
        .from('chat_history')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Convert database format to application format
      const messages = (data as SavedChatMessage[]).map((msg: SavedChatMessage): ChatMessage => ({
        id: msg.message_id,
        text: msg.content,
        isUser: msg.is_user,
      }));

      setHistory(messages);
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError(err instanceof Error ? err : new Error('Failed to load chat history'));
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Save a message to Supabase
  const saveMessage = useCallback(async (message: ChatMessage) => {
    try {
      const messageParams: SaveChatMessageParams = {
        message_id: message.id,
        conversation_id: conversationId,
        content: message.text,
        is_user: message.isUser,
      };

      // Use a typecast to handle the table not being in the TypeScript definitions
      const { error } = await (supabase as any)
        .from('chat_history')
        .insert(messageParams);

      if (error) throw error;
    } catch (err) {
      console.error('Error saving chat message:', err);
      setError(err instanceof Error ? err : new Error('Failed to save chat message'));
    }
  }, [conversationId]);

  // Load history on mount and when conversation ID changes
  useEffect(() => {
    if (conversationId) {
      loadChatHistory();
    }
  }, [conversationId, loadChatHistory]);

  // Add new message to state and save to Supabase
  const addMessage = useCallback(async (content: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: content,
      isUser,
    };

    setHistory(prev => [...prev, newMessage]);
    await saveMessage(newMessage);
    return newMessage;
  }, [saveMessage]);

  // Clear all messages for this conversation
  const clearHistory = useCallback(async () => {
    try {
      // Use a typecast to handle the table not being in the TypeScript definitions
      const { error } = await (supabase as any)
        .from('chat_history')
        .delete()
        .eq('conversation_id', conversationId);

      if (error) throw error;
      setHistory([]);
    } catch (err) {
      console.error('Error clearing chat history:', err);
      setError(err instanceof Error ? err : new Error('Failed to clear chat history'));
    }
  }, [conversationId]);

  return {
    history,
    loading,
    error,
    addMessage,
    clearHistory,
    loadChatHistory
  };
}
