import { createContext, useContext, ReactNode } from "react";
import { useTaskQuery } from "./task/useTaskQuery";
import { useTaskMutations } from "./task/useTaskMutations";
import { TaskContextType, Task, TaskUpdate } from "./task/taskTypes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
        navigate("/login");
        return null;
      }
      return session;
    },
  });

  const { data: tasks = [], isLoading, error } = useTaskQuery(!isSessionLoading && !!session);
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