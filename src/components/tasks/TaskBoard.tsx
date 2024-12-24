import { useTaskContext } from "@/contexts/TaskContext";
import { TaskList } from "../TaskList";
import { TaskDetails } from "./TaskDetails";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface TaskBoardProps {
  initialSelectedTaskId?: string | null;
}

export function TaskBoard({ initialSelectedTaskId }: TaskBoardProps) {
  const { tasks, isLoading, error } = useTaskContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialSelectedTaskId || null);

  useEffect(() => {
    if (initialSelectedTaskId) {
      setSelectedTaskId(initialSelectedTaskId);
    }
  }, [initialSelectedTaskId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
        <p className="text-destructive">Error loading tasks: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full my-6">
      <div className="w-full lg:w-1/2">
        <TaskList 
          tasks={tasks}
          onTaskSelect={(id) => setSelectedTaskId(id)} 
          selectedTaskId={selectedTaskId} 
        />
      </div>
      {selectedTaskId && (
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-3">Task Details</h2>
          <div className="h-[calc(100%-2rem)] bg-background border rounded-lg overflow-hidden">
            <TaskDetails taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
          </div>
        </div>
      )}
    </div>
  );
}