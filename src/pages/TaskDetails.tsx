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
          <h2 className="text-lg font-medium">Notes</h2>
          {task.notes && task.notes.length > 0 ? (
            <div className="space-y-2">
              {task.notes.map((note, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  {note}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No notes added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;