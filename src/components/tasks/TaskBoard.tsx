import { useTaskContext } from "@/contexts/TaskContext";
import { TaskList } from "./TaskList";
import { TaskDetails } from "./TaskDetails";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export function TaskBoard() {
  const { tasks, isLoading } = useTaskContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
        <TaskList 
          onTaskSelect={(id) => setSelectedTaskId(id.toLowerCase())} 
          selectedTaskId={selectedTaskId?.toLowerCase()} 
        />
      </div>
      <ScrollArea className="w-full lg:w-1/2">
        <div className="bg-background rounded-lg border p-10 mx-auto">
          {selectedTaskId ? (
            <TaskDetails taskId={selectedTaskId.toLowerCase()} onClose={() => setSelectedTaskId(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <p className="text-lg font-medium text-muted-foreground">No task selected</p>
              <p className="text-sm text-muted-foreground">
                Select a task from the list to view its details
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}