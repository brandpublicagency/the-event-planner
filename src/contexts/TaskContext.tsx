
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskUpdate, TaskContextType } from "./task/taskTypes";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      console.log("Fetching tasks from Supabase");
      
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching tasks:", error);
          throw new Error(error.message);
        }

        console.log("Tasks fetched successfully:", data);
        return data as Task[] || [];
      } catch (error: any) {
        console.error("Task fetch error:", error);
        throw new Error(error.message || "Failed to fetch tasks");
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const addTask = async (title: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add tasks",
        variant: "destructive",
      });
      throw new Error("Authentication required");
    }

    const { error } = await supabase
      .from("tasks")
      .insert([{ 
        title, 
        user_id: session.session.user.id,
        status: 'todo'
      }]);

    if (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    
    toast({
      title: "Task added",
      description: "Your task has been added successfully",
    });
  };

  const updateTask = async (id: string, updates: TaskUpdate) => {
    const { error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully",
    });
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully",
    });
  };

  const toggleTask = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", id);

    if (error) {
      console.error("Error toggling task:", error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const value: TaskContextType = {
    tasks: tasks || [],
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
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

export type { Task, TaskUpdate };
