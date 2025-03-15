
import { createContext, useContext } from "react";
import { Task, TaskUpdate, TaskContextType } from "./task/taskTypes";
import { useTaskProvider } from "./task/useTaskProvider";

// Create a context for tasks
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component that wraps parts of the app that need access to tasks
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const taskProvider = useTaskProvider();
  
  return (
    <TaskContext.Provider value={taskProvider}>
      {children}
    </TaskContext.Provider>
  );
}

// Hook to use the task context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}

// Re-export types for convenience
export type { Task, TaskUpdate };
