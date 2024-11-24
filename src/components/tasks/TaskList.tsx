import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard } from "./TaskCard";
import { EditableTaskCard } from "./EditableTaskCard";
import { Task } from "@/contexts/TaskContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function TaskList({ onTaskSelect, selectedTaskId }: { 
  onTaskSelect: (id: string) => void;
  selectedTaskId: string | null;
}) {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) {
        setError(error.message);
        return [];
      }
      return data as Task[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const upcomingTasks = tasks?.filter(task => !task.completed) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];

  const renderTaskList = (taskList: Task[]) => (
    <div className="space-y-3">
      {taskList.map((task) => (
        editingTask === task.id ? (
          <EditableTaskCard
            key={task.id}
            task={task}
            onCancel={() => setEditingTask(null)}
            onSave={() => setEditingTask(null)}
          />
        ) : (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={task.id === selectedTaskId}
            onClick={() => {
              onTaskSelect(task.id);
              setEditingTask(task.id);
            }}
          />
        )
      ))}
      {taskList.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No tasks</p>
      )}
    </div>
  );

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-6 pr-4">
        {upcomingTasks.length > 0 && (
          <div>
            {renderTaskList(upcomingTasks)}
          </div>
        )}

        {completedTasks.length > 0 && (
          <Collapsible open={isCompletedOpen} onOpenChange={setIsCompletedOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full text-xl font-semibold mb-3">
              {isCompletedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Completed Tasks ({completedTasks.length})
            </CollapsibleTrigger>
            <CollapsibleContent>
              {renderTaskList(completedTasks)}
            </CollapsibleContent>
          </Collapsible>
        )}

        {tasks?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No tasks found</p>
        )}
      </div>
    </ScrollArea>
  );
}