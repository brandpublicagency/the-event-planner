import { useTaskContext } from "@/contexts/TaskContext";
import { TaskList } from "../TaskList";
import { TaskDetails } from "./TaskDetails";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskBoardProps {
  initialSelectedTaskId?: string | null;
}

export function TaskBoard({ initialSelectedTaskId }: TaskBoardProps) {
  const { tasks, isLoading, error } = useTaskContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialSelectedTaskId || null);

  // Update selected task when initialSelectedTaskId changes
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const upcomingTasks = tasks?.filter(task => !task.completed) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full my-6">
      <div className="w-full lg:w-1/2">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="upcoming" className="flex-1">
              Upcoming ({upcomingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4">
            <TaskList 
              tasks={upcomingTasks}
              onTaskSelect={(id) => setSelectedTaskId(id)} 
              selectedTaskId={selectedTaskId} 
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <TaskList 
              tasks={completedTasks}
              onTaskSelect={(id) => setSelectedTaskId(id)} 
              selectedTaskId={selectedTaskId} 
            />
          </TabsContent>
        </Tabs>
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