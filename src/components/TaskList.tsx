import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
      // If on dashboard, navigate to tasks page
      navigate(`/tasks?selected=${taskId}`);
    } else if (onTaskSelect) {
      // If on tasks page, use the selection handler
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
        <div
          key={task.id}
          className={cn(
            "group flex items-center px-4 py-3 hover:bg-zinc-50/50 transition-colors rounded-lg border bg-white",
            selectedTaskId === task.id && "border-primary bg-primary/5"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              className="h-auto p-0 text-sm font-medium hover:text-primary"
              onClick={() => handleTaskClick(task.id)}
            >
              {task.title}
            </Button>
            <div className="flex items-center gap-3">
              {task.due_date && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.due_date), "dd MMM yyyy")}</span>
                </div>
              )}
              {task.priority && (
                <Badge variant="secondary" className="bg-zinc-100 text-zinc-600">
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
      {tasks?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No upcoming tasks</p>
      )}
    </div>
  );
}