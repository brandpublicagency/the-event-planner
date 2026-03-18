
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TaskUpdate } from "./taskTypes";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Failed to verify session");
      }
      
      if (!sessionData.session) {
        console.error("No active session found");
        throw new Error("Authentication required");
      }
      const { error } = await supabase.from("tasks").insert([
        { 
          title,
          user_id: sessionData.session.user.id,
          status: "todo",
        }
      ]);
      
      if (error) {
        console.error("Task insert error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task added successfully");
    },
    onError: (error: Error) => {
      console.error("Add task error:", error);
      toast.error("Failed to add task");
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Failed to verify session");
      }
      
      if (!sessionData.session) {
        console.error("No active session found");
        throw new Error("Authentication required");
      }
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id);
        
      if (error) {
        console.error("Task update error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
    },
    onError: (error: Error) => {
      console.error("Update task error:", error);
      toast.error("Failed to update task");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Failed to verify session");
      }
      
      if (!sessionData.session) {
        console.error("No active session found");
        throw new Error("Authentication required");
      }
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error("Task delete error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
    },
  });

  return {
    addTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};
