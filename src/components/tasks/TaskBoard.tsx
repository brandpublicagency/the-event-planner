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
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      <div className="flex-1">
        <TaskList onTaskSelect={setSelectedTaskId} selectedTaskId={selectedTaskId} />
      </div>
      <ScrollArea className="w-[400px] border-l">
        {selectedTaskId ? (
          <TaskDetails taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Select a task to view details
          </div>
        )}
      </ScrollArea>
    </div>
  );
}