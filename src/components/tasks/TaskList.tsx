import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard } from "./TaskCard";
import { EditableTaskCard } from "./EditableTaskCard";
import { Task } from "@/contexts/TaskContext";

export function TaskList({ onTaskSelect, selectedTaskId }: { 
  onTaskSelect: (id: string) => void;
  selectedTaskId: string | null;
}) {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

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

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-2">
        {tasks?.map((task) => (
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
        {tasks?.length === 0 && (
          <p className="text-center text-gray-500 py-8">No tasks found</p>
        )}
      </div>
    </ScrollArea>
  );
}