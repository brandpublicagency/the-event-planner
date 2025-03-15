
import { createContext, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskUpdate, TaskContextType } from "./task/taskTypes";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to auth changes to invalidate tasks query when auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state changed:", event);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      console.log("Fetching tasks from Supabase");
      
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return [];
        }
        
        if (!sessionData.session) {
          console.log("No active session found");
          return [];
        }
        
        console.log("Session found, user ID:", sessionData.session.user.id);
        
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
    staleTime: 10000, // 10 seconds
  });

  const addTask = async (title: string) => {
    console.log("Adding task:", title);
    
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      toast({
        title: "Authentication error",
        description: "Failed to verify your session",
        variant: "destructive",
      });
      throw sessionError;
    }
    
    if (!session?.session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add tasks",
        variant: "destructive",
      });
      throw new Error("Authentication required");
    }

    console.log("User authenticated, creating task for user:", session.session.user.id);

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
    
    console.log("Task added successfully, invalidating query");
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    
    toast({
      title: "Task added",
      description: "Your task has been added successfully",
    });
  };

  const updateTask = async (id: string, updates: TaskUpdate) => {
    console.log("Updating task:", id, updates);
    
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      toast({
        title: "Authentication error",
        description: "Failed to verify your session",
        variant: "destructive",
      });
      throw sessionError;
    }
    
    if (!session?.session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update tasks",
        variant: "destructive",
      });
      throw new Error("Authentication required");
    }

    console.log("User authenticated, updating task");

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
    
    console.log("Task updated successfully, invalidating query");
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully",
    });
  };

  const deleteTask = async (id: string) => {
    console.log("Deleting task:", id);
    
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      toast({
        title: "Authentication error",
        description: "Failed to verify your session",
        variant: "destructive",
      });
      throw sessionError;
    }
    
    if (!session?.session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete tasks",
        variant: "destructive",
      });
      throw new Error("Authentication required");
    }

    console.log("User authenticated, deleting task");

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
    
    console.log("Task deleted successfully, invalidating query");
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully",
    });
  };

  const toggleTask = async (id: string, completed: boolean) => {
    console.log("Toggling task:", id, completed);
    
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      toast({
        title: "Authentication error",
        description: "Failed to verify your session",
        variant: "destructive",
      });
      throw sessionError;
    }
    
    if (!session?.session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update tasks",
        variant: "destructive",
      });
      throw new Error("Authentication required");
    }

    console.log("User authenticated, toggling task");

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
    
    console.log("Task toggled successfully, invalidating query");
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
