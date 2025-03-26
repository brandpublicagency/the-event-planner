
import { format } from "https://esm.sh/date-fns@2.30.0";
import { createSupabaseClient } from "../../_shared/supabaseClient.ts";

/**
 * Fetches important tasks due today
 */
export const fetchTasks = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  console.log(`Fetching tasks for today: ${todayStr}`);
  
  try {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("completed", false)
      .lte("due_date", todayStr)
      .order("priority", { ascending: true })
      .limit(5); // Get up to 5 tasks for more context
    
    if (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    return [];
  }
};
