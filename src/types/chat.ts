
// This is a simplified version of the chat types without OpenAI references

export interface ChatMessage {
  text: string;
  isUser: boolean;
  id?: string;
  timestamp?: Date;
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
