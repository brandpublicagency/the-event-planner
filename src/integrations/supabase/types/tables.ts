
import { Database } from './base';

export type Tables = Database['public']['Tables'];
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];

// Define mention types
export interface Mention {
  id: string;
  type: 'document' | 'task' | 'event';
}

// Update these interfaces to include the mentions fields
export interface DocumentRow extends Omit<TablesRow<'documents'>, 'mentions' | 'mentioned_in'> {
  mentions?: Mention[];
  mentioned_in?: Mention[];
}

export interface TaskRow extends Omit<TablesRow<'tasks'>, 'mentions' | 'mentioned_in'> {
  mentions?: Mention[];
  mentioned_in?: Mention[];
}

export interface EventRow extends Omit<TablesRow<'events'>, 'mentions' | 'mentioned_in'> {
  mentions?: Mention[];
  mentioned_in?: Mention[];
}
