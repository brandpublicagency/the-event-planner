import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TablesRow, TablesInsert, TablesUpdate } from "@/integrations/supabase/types/tables";

export type Task = TablesRow<'tasks'>;
type TaskInsert = TablesInsert<'tasks'>;
type TaskUpdate = TablesUpdate<'tasks'>;

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (title: string) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const { error } = await supabase.from("tasks").insert([
        { 
          title,
          user_id: session.user.id,
          status: "todo",
        }
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .eq("user_id", session.user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("User not authenticated");

      // First, delete all associated files from storage
      const { data: files, error: filesError } = await supabase
        .from("task_files")
        .select("file_path")
        .eq("task_id", id);

      if (filesError) throw filesError;

      if (files && files.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("task-files")
          .remove(files.map(file => file.file_path));

        if (storageError) throw storageError;
      }

      // Then delete the file records
      const { error: fileDeleteError } = await supabase
        .from("task_files")
        .delete()
        .eq("task_id", id);

      if (fileDeleteError) throw fileDeleteError;

      // Finally delete the task
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleTask = async (id: string, completed: boolean) => {
    await updateTaskMutation.mutateAsync({ 
      id, 
      updates: { completed } 
    });
  };

  const value = {
    tasks,
    isLoading,
    addTask: (title: string) => addTaskMutation.mutateAsync(title),
    updateTask: (id: string, updates: TaskUpdate) =>
      updateTaskMutation.mutateAsync({ id, updates }),
    deleteTask: (id: string) => deleteTaskMutation.mutateAsync(id),
    toggleTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}