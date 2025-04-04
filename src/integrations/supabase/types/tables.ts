
import { Database } from './base';
import { Json } from './json';

export type Tables = Database['public']['Tables'];
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];

// Define mention types
export interface Mention {
  id: string;
  type: 'document' | 'task' | 'event';
}

// Define the document row with mentions fields
export interface DocumentRow extends Omit<TablesRow<'documents'>, 'mentions' | 'mentioned_in'> {
  mentions?: Json;
  mentioned_in?: Json;
}

// Define the task row with mentions fields
export interface TaskRow {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  task_code: string | null;
  due_date: string | null;
  priority: string | null;
  status: string;
  assigned_to: string | null;
  notes: string[] | null;
  todos: string[] | null;
  mentions?: Json;
  mentioned_in?: Json;
}

// Define the event row with mentions fields
export interface EventRow {
  address: string | null;
  company: string | null;
  completed: boolean | null;
  created_at: string;
  created_by: string | null;
  deleted_at: string | null;
  description: string | null;
  end_time: string | null;
  event_code: string;
  event_date: string | null;
  event_type: string;
  name: string;
  package_id: string | null;
  pax: number | null;
  start_time: string | null;
  updated_at: string;
  venues: string[] | null;
  primary_email: string | null;
  primary_name: string | null;
  primary_phone: string | null;
  secondary_email: string | null;
  secondary_name: string | null;
  secondary_phone: string | null;
  event_notes: string | null;
  vat_number: string | null;
  external_event_id: string | null;
  mentions?: Json;
  mentioned_in?: Json;
}

// Define the task insert with mentions fields
export interface TaskInsert {
  id?: string;
  title: string;
  completed?: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  task_code?: string | null;
  due_date?: string | null;
  priority?: string | null;
  status?: string;
  assigned_to?: string | null;
  notes?: string[] | null;
  todos?: string[] | null;
  mentions?: Json;
  mentioned_in?: Json;
}

// Define the task update with mentions fields
export interface TaskUpdate {
  id?: string;
  title?: string;
  completed?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  task_code?: string | null;
  due_date?: string | null;
  priority?: string | null;
  status?: string;
  assigned_to?: string | null;
  notes?: string[] | null;
  todos?: string[] | null;
  mentions?: Json;
  mentioned_in?: Json;
}

// Define the event insert and update with mentions fields
export interface EventInsert {
  address?: string | null;
  company?: string | null;
  completed?: boolean | null;
  created_at?: string;
  created_by?: string | null;
  deleted_at?: string | null;
  description?: string | null;
  end_time?: string | null;
  event_code: string;
  event_date?: string | null;
  event_type: string;
  name: string;
  package_id?: string | null;
  pax?: number | null;
  start_time?: string | null;
  updated_at?: string;
  venues?: string[] | null;
  primary_email?: string | null;
  primary_name?: string | null;
  primary_phone?: string | null;
  secondary_email?: string | null;
  secondary_name?: string | null;
  secondary_phone?: string | null;
  event_notes?: string | null;
  vat_number?: string | null;
  external_event_id?: string | null;
  mentions?: Json;
  mentioned_in?: Json;
}

export interface EventUpdate {
  address?: string | null;
  company?: string | null;
  completed?: boolean | null;
  created_at?: string;
  created_by?: string | null;
  deleted_at?: string | null;
  description?: string | null;
  end_time?: string | null;
  event_code?: string;
  event_date?: string | null;
  event_type?: string;
  name?: string;
  package_id?: string | null;
  pax?: number | null;
  start_time?: string | null;
  updated_at?: string;
  venues?: string[] | null;
  primary_email?: string | null;
  primary_name?: string | null;
  primary_phone?: string | null;
  secondary_email?: string | null;
  secondary_name?: string | null;
  secondary_phone?: string | null;
  event_notes?: string | null;
  vat_number?: string | null;
  external_event_id?: string | null;
  mentions?: Json;
  mentioned_in?: Json;
}
