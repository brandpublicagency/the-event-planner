import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Task } from "@/contexts/TaskContext";

export function useTaskDelete(task: Task) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      
      const { data: files, error: filesError } = await supabase
        .from("task_files")
        .select("file_path")
        .eq("task_id", task.id);

      if (filesError) throw filesError;

      if (files && files.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("task-files")
          .remove(files.map(file => file.file_path));

        if (storageError) throw storageError;
      }

      const { error: fileDeleteError } = await supabase
        .from("task_files")
        .delete()
        .eq("task_id", task.id);

      if (fileDeleteError) throw fileDeleteError;

      const { error: taskDeleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id)
        .eq("user_id", task.user_id);

      if (taskDeleteError) throw taskDeleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted.`,
      });
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  return {
    isDeleting,
    deleteTask: () => deleteTaskMutation.mutate(),
  };
}