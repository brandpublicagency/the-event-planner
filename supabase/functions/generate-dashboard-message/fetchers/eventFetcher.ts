
import { format } from "https://esm.sh/date-fns@2.30.0";
import { createSupabaseClient } from "../../_shared/supabaseClient.ts";

/**
 * Fetches events scheduled for today
 */
export const fetchTodayEvents = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  console.log(`Fetching events for today: ${todayStr}`);
  
  try {
    const { data, error } = await supabaseClient
      .from("events")
      .select("*")
      .eq("event_date", todayStr)
      .is("deleted_at", null)
      .eq("completed", false)
      .order("start_time", { ascending: true })
      .limit(3); // Get up to 3 events for today for more context
    
    if (error) {
      console.error("Error fetching today's events:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchTodayEvents:", error);
    return [];
  }
};

/**
 * Fetches upcoming events within the next week
 */
export const fetchUpcomingEvents = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekStr = format(nextWeek, "yyyy-MM-dd");
  
  console.log(`Fetching upcoming events from ${todayStr} to ${nextWeekStr}`);
  
  try {
    const { data, error } = await supabaseClient
      .from("events")
      .select("*")
      .gt("event_date", todayStr)
      .lte("event_date", nextWeekStr)
      .is("deleted_at", null)
      .eq("completed", false)
      .order("event_date", { ascending: true })
      .limit(3); // Get up to 3 upcoming events for more context
    
    if (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchUpcomingEvents:", error);
    return [];
  }
};
