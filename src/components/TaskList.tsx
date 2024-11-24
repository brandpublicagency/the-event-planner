import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TaskItem } from "./tasks/TaskItem";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  priority: string | null;
}

interface TaskListProps {
  onTaskSelect?: (id: string) => void;
  selectedTaskId?: string | null;
}

export function TaskList({ onTaskSelect, selectedTaskId }: TaskListProps) {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("completed", false)
        .order("due_date", { ascending: true });

      if (error) {
        setError(error.message);
        return [];
      }
      return data as Task[];
    },
  });

  const handleTaskClick = (taskId: string) => {
    if (location.pathname === "/") {
      navigate(`/tasks?selected=${taskId}`);
    } else if (onTaskSelect) {
      onTaskSelect(taskId);
    }
  };

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
    <div className="space-y-2">
      {tasks?.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          title={task.title}
          completed={task.completed}
          dueDate={task.due_date}
          priority={task.priority}
          isSelected={task.id === selectedTaskId}
          onClick={() => handleTaskClick(task.id)}
        />
      ))}
      {tasks?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No upcoming tasks</p>
      )}
    </div>
  );
}