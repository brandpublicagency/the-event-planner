import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskUpdate } from "./task/taskTypes";

interface TaskContextType {
  tasks: Task[] | undefined;
  isLoading: boolean;
  error: Error | null;
  addTask: (title: string) => Promise<void>;
  createTask: (newTask: Partial<Task>) => void;
  updateTask: (task: Partial<Task> & { id: string }) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      console.log("Fetching tasks");
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from("tasks")
        .select()
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }

      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const addTask = async (title: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error("Authentication required");
    }

    const { error } = await supabase
      .from("tasks")
      .insert([{ title, user_id: session.session.user.id }]);

    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const createTask = useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert({ ...newTask, user_id: session.session.user.id })
        .select()
        .single();

      if (error) {
        console.error("Error creating task:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Create task error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating task:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
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

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting task:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
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
    const { error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", id);

    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const value = {
    tasks,
    isLoading,
    error,
    addTask,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    deleteTask: deleteTask.mutate,
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