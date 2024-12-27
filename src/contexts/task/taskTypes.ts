import { Database } from "@/integrations/supabase/types/database";

export type Tables = Database['public']['Tables'];
export type Task = Tables['tasks']['Row'];
export type TaskUpdate = Partial<Pick<Task, 'title' | 'completed' | 'due_date' | 'priority' | 'status' | 'assigned_to' | 'notes' | 'todos'>>;

export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  addTask: (title: string) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
}