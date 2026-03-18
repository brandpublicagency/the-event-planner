
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./taskTypes";
import { toast } from "@/hooks/use-toast";

export const useTaskQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast.error("Authentication error");
          return [];
        }
        
        if (!sessionData.session) {
          return [];
        }
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Task fetch error:", error);
          toast.error("Failed to load tasks");
          throw error;
        }
        return data as Task[];
      } catch (error: any) {
        console.error("Task query error:", error);
        toast.error("Error loading tasks: " + (error.message || "Unknown error"));
        throw error;
      }
    },
    enabled,
    retry: 1,
    staleTime: 30000,
  });
};
