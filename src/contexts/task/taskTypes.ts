export interface Task {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  task_code?: string | null;
  due_date?: string | null;
  priority?: string | null;
  status: string;
  assigned_to?: string | null;
  notes?: string[] | null;
  todos?: string[] | null;
}

export interface TaskUpdate {
  title?: string;
  completed?: boolean;
  task_code?: string | null;
  due_date?: string | null;
  priority?: string | null;
  status?: string;
  assigned_to?: string | null;
  notes?: string[] | null;
  todos?: string[] | null;
}

export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  addTask: (title: string) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
}