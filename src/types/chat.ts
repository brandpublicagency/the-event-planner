import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export interface ChatMessage {
  text: string;
  isUser: boolean;
  id?: string;
}

export interface PendingAction {
  action: string;
  event_code?: string;
  updates?: Record<string, any>;
  menu_updates?: Record<string, any>;
  to?: string[];
  subject?: string;
  content?: string;
  event_data?: Record<string, any>;
  task_data?: Record<string, any>;
  task_id?: string;
  document_id?: string;
  contact_id?: string;
  confirmationMessage?: string;
}

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessageForAPI = ChatCompletionMessageParam;

// Add interfaces for the saved chat messages in the database
export interface SavedChatMessage {
  id: string;
  message_id: string;
  conversation_id: string;
  content: string;
  is_user: boolean;
  created_at: string;
}

export interface SaveChatMessageParams {
  message_id: string;
  conversation_id: string;
  content: string;
  is_user: boolean;
}
