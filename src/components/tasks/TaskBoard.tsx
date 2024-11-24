import { useTaskContext } from "@/contexts/TaskContext";
import { TaskColumn } from "./TaskColumn";
import { TaskDetails } from "./TaskDetails";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      <div className="flex-1 flex gap-4">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          status="todo"
          onTaskSelect={setSelectedTaskId}
          selectedTaskId={selectedTaskId}
        />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          status="in-progress"
          onTaskSelect={setSelectedTaskId}
          selectedTaskId={selectedTaskId}
        />
        <TaskColumn
          title="Completed"
          tasks={completedTasks}
          status="completed"
          onTaskSelect={setSelectedTaskId}
          selectedTaskId={selectedTaskId}
        />
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