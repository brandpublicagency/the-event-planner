import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const TaskDetails = () => {
  const { id } = useParams();

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Task not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            {task.priority && (
              <Badge variant="secondary">{task.priority}</Badge>
            )}
            {task.due_date && (
              <span className="text-sm text-muted-foreground">
                Due {format(new Date(task.due_date), "PPP")}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">NotesLet me help fix the task title click functionality. The issue is that we need to implement the task details view and ensure proper navigation. Let me check the code and fix this.

<lov-code>
First, let's update the TaskBoard component to handle task selection and display task details:

<lov-write file_path="src/components/tasks/TaskBoard.tsx">
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