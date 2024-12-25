import { createContext, useContext, ReactNode } from "react";
import { useTaskQuery } from "./task/useTaskQuery";
import { useTaskMutations } from "./task/useTaskMutations";
import { TaskContextType, Task, TaskUpdate } from "./task/taskTypes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type { Task, TaskUpdate, TaskContextType };

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // Query for session
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        toast.error("Authentication error occurred");
        navigate("/login");
        return null;
      }
      return session;
    },
  });

  // Only fetch tasks if we have a session
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Task fetch error:", error);
          toast.error("Failed to load tasks");
          throw error;
        }

        console.log("Fetched tasks:", data);
        return data as Task[];
      } catch (error) {
        console.error("Task query error:", error);
        throw error;
      }
    },
    enabled: !!session, // Only run query if session exists
  });

  const { addTaskMutation, updateTaskMutation, deleteTaskMutation } = useTaskMutations();

  const toggleTask = async (id: string, completed: boolean) => {
    await updateTaskMutation.mutateAsync({ 
      id, 
      updates: { completed } 
    });
  };

  const value: TaskContextType = {
    tasks: tasks as Task[],
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