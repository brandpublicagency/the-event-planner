import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TaskUpdate } from "./taskTypes";

export const useTaskMutations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAuthError = (error: Error) => {
    console.error("Authentication error:", error);
    if (error.message === "User not authenticated") {
      navigate("/login");
    }
    toast({
      title: "Authentication required",
      description: "Please sign in to continue",
      variant: "destructive",
    });
  };

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("tasks").insert([
        { 
          title,
          user_id: user.id,
          status: "todo",
        }
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Add task error:", error);
      handleAuthError(error);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      console.error("Update task error:", error);
      handleAuthError(error);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // First, get all associated files
      const { data: files, error: filesError } = await supabase
        .from("task_files")
        .select("file_path")
        .eq("task_id", id);

      if (filesError) throw filesError;

      // Delete files from storage if they exist
      if (files && files.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("task-files")
          .remove(files.map(file => file.file_path));

        if (storageError) throw storageError;
      }

      // Delete file records from the database
      const { error: fileDeleteError } = await supabase
        .from("task_files")
        .delete()
        .eq("task_id", id);

      if (fileDeleteError) throw fileDeleteError;

      // Finally delete the task
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Delete task error:", error);
      handleAuthError(error);
    },
  });

  return {
    addTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};