import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  priority: string | null;
}

const TaskList = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
          className="group flex items-center px-4 py-3 hover:bg-zinc-50/50 transition-colors rounded-lg border bg-white"
        >
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="text-sm font-medium truncate hover:text-zinc-600 transition-colors text-left"
            >
              {task.title}
            </button>
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
};

export default TaskList;