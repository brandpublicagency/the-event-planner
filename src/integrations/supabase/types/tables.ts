
import { Database } from './base';

export type Tables = Database['public']['Tables'];
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];

// Update these interfaces to include the mentions fields
export interface DocumentRow extends TablesRow<'documents'> {
  mentions?: any[];
  mentioned_in?: any[];
}

export interface TaskRow extends TablesRow<'tasks'> {
  mentions?: any[];
  mentioned_in?: any[];
}

export interface EventRow extends TablesRow<'events'> {
  mentions?: any[];
  mentioned_in?: any[];
}
