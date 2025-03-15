
import { format } from "https://esm.sh/date-fns@2.30.0";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";

/**
 * Fetches events scheduled for today
 */
export const fetchTodayEvents = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .eq("event_date", todayStr)
    .is("deleted_at", null)
    .eq("completed", false)
    .order("start_time", { ascending: true })
    .limit(1);
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Checks if today is a holiday
 */
export const fetchHolidays = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  const { data, error } = await supabaseClient
    .from("holiday_messages")
    .select("*")
    .eq("holiday_date", todayStr)
    .limit(1);
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Fetches important tasks due today
 */
export const fetchTasks = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("completed", false)
    .lte("due_date", todayStr)
    .order("priority", { ascending: true })
    .limit(3);
  
  if (error) {
    throw error;
  }
  
  return data;
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
  
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .gt("event_date", todayStr)
    .lte("event_date", nextWeekStr)
    .is("deleted_at", null)
    .eq("completed", false)
    .order("event_date", { ascending: true })
    .limit(1);
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Fetches motivational messages as fallback
 */
export const fetchMotivationalMessages = async () => {
  const supabaseClient = createSupabaseClient();
  
  const { data, error } = await supabaseClient
    .from("motivational_messages")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
};
