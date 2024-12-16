import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./taskTypes";

export const useTaskQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 10000);
      });

      try {
        const fetchPromise = supabase.auth.getUser().then(async ({ data: { user } }) => {
          if (!user) {
            throw new Error("No authenticated user");
          }

          const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return data as Task[];
        });

        return Promise.race([fetchPromise, timeoutPromise]);
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