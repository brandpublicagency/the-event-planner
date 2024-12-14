export interface ChatMessage {
  text: string;
  isUser: boolean;
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
}