
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./taskTypes";
import { toast } from "sonner";

export const useTaskQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      console.log("Executing tasks query function...");
      
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return [];
        }
        
        if (!sessionData.session) {
          console.log("No active session found in useTaskQuery");
          return [];
        }
        
        console.log("Session found, fetching tasks...");
        
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Task fetch error:", error);
          toast.error("Failed to load tasks");
          throw error;
        }

        console.log("Tasks fetched successfully:", data);
        return data as Task[];
      } catch (error) {
        console.error("Task query error:", error);
        throw error;
      }
    },
    enabled,
    retry: 1,
    staleTime: 30000,
  });
};
