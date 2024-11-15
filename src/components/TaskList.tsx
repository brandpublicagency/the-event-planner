import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
}

const TaskList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
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
    <div className="space-y-4">
      {tasks?.map((task) => (
        <div
          key={task.id}
          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg"
        >
          <Checkbox
            id={task.id}
            checked={task.completed}
            onCheckedChange={(checked) => {
              updateTaskMutation.mutate({
                id: task.id,
                completed: checked as boolean,
              });
            }}
          />
          <label
            htmlFor={task.id}
            className={`text-sm ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </label>
        </div>
      ))}
      {tasks?.length === 0 && (
        <p className="text-center text-gray-500">No tasks found</p>
      )}
    </div>
  );
};

export default TaskList;