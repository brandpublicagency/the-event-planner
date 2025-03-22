
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskUpdate } from "@/contexts/TaskContext";

export function useTaskMutation(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: TaskUpdate) => {
      // Update the task
      const { error, data: updatedTask } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      
      return updatedTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      console.log("Task updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating task:", error.message);
    },
  });
}
