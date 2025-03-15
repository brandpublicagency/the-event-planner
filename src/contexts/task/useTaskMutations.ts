
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskUpdate } from "./taskTypes";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      console.log("Adding task:", title);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("User fetch error:", userError);
        throw new Error("Failed to authenticate");
      }
      
      if (!userData?.user) {
        console.error("No user found");
        throw new Error("User not authenticated");
      }

      console.log("User authenticated, creating task");
      
      const { error } = await supabase.from("tasks").insert([
        { 
          title,
          user_id: userData.user.id,
          status: "todo",
        }
      ]);
      
      if (error) {
        console.error("Task insert error:", error);
        throw error;
      }
      
      console.log("Task created successfully");
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
      console.log("Updating task:", id, updates);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("User fetch error:", userError);
        throw new Error("Failed to authenticate");
      }
      
      if (!userData?.user) {
        console.error("No user found");
        throw new Error("User not authenticated");
      }
      
      console.log("User authenticated, updating task");
      
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id);
        
      if (error) {
        console.error("Task update error:", error);
        throw error;
      }
      
      console.log("Task updated successfully");
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
      console.log("Deleting task:", id);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("User fetch error:", userError);
        throw new Error("Failed to authenticate");
      }
      
      if (!userData?.user) {
        console.error("No user found");
        throw new Error("User not authenticated");
      }
      
      console.log("User authenticated, deleting task");
      
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error("Task delete error:", error);
        throw error;
      }
      
      console.log("Task deleted successfully");
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
