import { useTaskContext } from "@/contexts/TaskContext";
import { TaskList } from "./TaskList";
import { TaskDetails } from "./TaskDetails";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface TaskBoardProps {
  initialSelectedTaskId?: string | null;
}

export function TaskBoard({ initialSelectedTaskId }: TaskBoardProps) {
  const { tasks, isLoading } = useTaskContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialSelectedTaskId || null);

  // Update selected task when initialSelectedTaskId changes
  useEffect(() => {
    if (initialSelectedTaskId) {
      setSelectedTaskId(initialSelectedTaskId);
    }
  }, [initialSelectedTaskId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)]">
      <div className="w-full lg:w-1/2">
        <h2 className="text-xl font-semibold mb-3">Upcoming Tasks</h2>
        <TaskList 
          onTaskSelect={(id) => setSelectedTaskId(id.toLowerCase())} 
          selectedTaskId={selectedTaskId?.toLowerCase()} 
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h2 className="text-xl font-semibold mb-3">Task Details</h2>
        <div className="h-[calc(100%-2rem)] bg-background border rounded-lg overflow-hidden">
          {selectedTaskId ? (
            <TaskDetails taskId={selectedTaskId.toLowerCase()} onClose={() => setSelectedTaskId(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 p-10">
              <p className="text-lg font-medium text-muted-foreground">No task selected</p>
              <p className="text-sm text-muted-foreground">
                Select a task from the list to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}