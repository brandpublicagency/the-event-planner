
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./taskTypes";
import { useTaskQuery } from "./useTaskQuery";
import { useTaskMutations } from "./useTaskMutations";
import { toast } from "@/hooks/use-toast";

export const useTaskProvider = () => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Set up authentication state listener
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      setIsAuthenticated(!!session);
      
      if (event === 'SIGNED_OUT') {
        // Clear tasks when signed out
        queryClient.setQueryData(["tasks"], []);
      } else if (event === 'SIGNED_IN') {
        // Refresh tasks when signed in
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Use the task query hook to fetch tasks
  const { 
    data: tasks = [], 
    isLoading, 
    error 
  } = useTaskQuery(isAuthenticated);

  // Use the task mutations hook for task operations
  const { 
    addTaskMutation, 
    updateTaskMutation, 
    deleteTaskMutation 
  } = useTaskMutations();

  // Wrapper functions for mutations
  const addTask = async (title: string) => {
    try {
      await addTaskMutation.mutateAsync(title);
    } catch (error: any) {
      console.error("Add task error:", error);
      toast.error("Failed to add task: " + (error.message || "Unknown error"));
      throw error;
    }
  };

  const updateTask = async (id: string, updates: any) => {
    try {
      await updateTaskMutation.mutateAsync({ id, updates });
    } catch (error: any) {
      console.error("Update task error:", error);
      toast.error("Failed to update task: " + (error.message || "Unknown error"));
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync(id);
    } catch (error: any) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task: " + (error.message || "Unknown error"));
      throw error;
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await updateTaskMutation.mutateAsync({ 
        id, 
        updates: { completed } 
      });
    } catch (error: any) {
      console.error("Toggle task error:", error);
      toast.error("Failed to update task: " + (error.message || "Unknown error"));
      throw error;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    isAuthenticated
  };
};
