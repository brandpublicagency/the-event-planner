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
      <div className="w-1/2">
        <TaskList onTaskSelect={(id) => setSelectedTaskId(id.toLowerCase())} selectedTaskId={selectedTaskId?.toLowerCase()} />
      </div>
      <ScrollArea className="w-1/2 border-l bg-white h-[calc(100vh-12rem)] -mt-6 -mb-6 -mr-8 pl-6">
        {selectedTaskId ? (
          <TaskDetails taskId={selectedTaskId.toLowerCase()} onClose={() => setSelectedTaskId(null)} />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Select a task to view details
          </div>
        )}
      </ScrollArea>
    </div>
  );
}