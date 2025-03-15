
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TaskUpdate } from "@/contexts/TaskContext";
import { useTaskActivityLogging } from "@/hooks/useTaskActivityLogging";

export function useTaskMutation(taskId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logTaskUpdated } = useTaskActivityLogging();

  return useMutation({
    mutationFn: async (updates: TaskUpdate) => {
      // First fetch the current task to compare changes later
      const { data: existingTask, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update the task
      const { error, data: updatedTask } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      
      // Log the changes if successful
      if (updatedTask) {
        const updatedFields = Object.keys(updates);
        return await logTaskUpdated(updatedTask, updatedFields);
      }
      
      return updatedTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
