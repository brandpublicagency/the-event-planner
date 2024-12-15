import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TablesRow, TablesInsert, TablesUpdate } from "@/integrations/supabase/types/tables";
import { useNavigate } from "react-router-dom";

export type Task = TablesRow<'tasks'>;
type TaskInsert = TablesInsert<'tasks'>;
type TaskUpdate = TablesUpdate<'tasks'>;

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  addTask: (title: string) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query for session
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        navigate("/login");
        return null;
      }
      if (!session) {
        navigate("/login");
        return null;
      }
      return session;
    },
  });

  // Query for tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
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
    enabled: !!session?.user?.id && !isSessionLoading,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!session?.user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add tasks",
          variant: "destructive",
        });
        navigate("/login");
        throw new Error("User not authenticated");
      }

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
      console.error("Add task error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
      if (!session?.user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to update tasks",
          variant: "destructive",
        });
        navigate("/login");
        throw new Error("User not authenticated");
      }

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
      console.error("Update task error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to delete tasks",
          variant: "destructive",
        });
        navigate("/login");
        throw new Error("User not authenticated");
      }

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
      console.error("Delete task error:", error);
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
    isLoading: isLoading || isSessionLoading,
    error,
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