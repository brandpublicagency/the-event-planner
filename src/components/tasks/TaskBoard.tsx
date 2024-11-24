import { useTaskContext } from "@/contexts/TaskContext";
import { TaskList } from "../TaskList";
import { TaskDetails } from "./TaskDetails";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface TaskBoardProps {
  initialSelectedTaskId?: string | null;
}

export function TaskBoard({ initialSelectedTaskId }: TaskBoardProps) {
  const { tasks, isLoading } = useTaskContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialSelectedTaskId || null);

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

  const upcomingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-card border shadow-sm">
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
            <div className="h-[calc(100vh-20rem)] overflow-auto pr-2">
              <TaskList 
                tasks={upcomingTasks}
                onTaskSelect={(id) => setSelectedTaskId(id)} 
                selectedTaskId={selectedTaskId} 
              />
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <div className="h-[calc(100vh-20rem)] overflow-auto pr-2">
              <TaskList 
                tasks={completedTasks}
                onTaskSelect={(id) => setSelectedTaskId(id)} 
                selectedTaskId={selectedTaskId} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6 bg-card border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>
        <div className="h-[calc(100vh-22rem)] overflow-auto">
          {selectedTaskId ? (
            <TaskDetails taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <p className="text-lg font-medium text-muted-foreground">No task selected</p>
              <p className="text-sm text-muted-foreground">
                Select a task from the list to view its details
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}