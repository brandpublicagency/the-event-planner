import { TablesRow, TablesUpdate } from "@/integrations/supabase/types/tables";

export type Task = TablesRow<'tasks'>;
export type TaskUpdate = TablesUpdate<'tasks'>;

export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  addTask: (title: string) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
}