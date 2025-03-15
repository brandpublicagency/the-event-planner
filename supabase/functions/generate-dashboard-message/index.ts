
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { format } from "https://esm.sh/date-fns@2.30.0";

interface DashboardMessage {
  message: string;
  type: 'event' | 'holiday' | 'task' | 'upcoming_event' | 'motivational' | 'default';
  eventDetails?: any;
  tasks?: any[];
  holidayName?: string;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get today's date
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    
    // 1. Check if today is an event day
    const { data: todayEvents, error: eventsError } = await supabaseClient
      .from("events")
      .select("*")
      .eq("event_date", todayStr)
      .is("deleted_at", null)
      .eq("completed", false)
      .order("start_time", { ascending: true })
      .limit(1);
    
    if (eventsError) {
      throw eventsError;
    }
    
    if (todayEvents && todayEvents.length > 0) {
      const event = todayEvents[0];
      let message = "";
      
      // Customize message based on event type
      if (event.event_type === "Wedding") {
        if (event.primary_name && event.secondary_name) {
          message = `Today is ${event.primary_name} + ${event.secondary_name}'s Wedding Day! Remember, this is their most special day, and you are part of it!`;
        } else if (event.primary_name) {
          message = `Today is ${event.primary_name}'s Wedding Day! Remember, this is their most special day, and you are part of it!`;
        } else {
          message = `Today is a Wedding Day at ${event.name}! Remember, this is a couple's most special day, and you are part of it!`;
        }
      } else {
        // For non-wedding events
        message = `Today is ${event.name}`;
        
        if (event.primary_name) {
          message += ` for ${event.primary_name}`;
          if (event.secondary_name) {
            message += ` and ${event.secondary_name}`;
          }
        }
        
        message += ". This is their big day, and you are part of making it unforgettable. Good luck and give it your all!";
      }
      
      return new Response(
        JSON.stringify({
          message,
          type: "event",
          eventDetails: event
        } as DashboardMessage),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 2. Check if today is a holiday
    const { data: holidays, error: holidaysError } = await supabaseClient
      .from("holiday_messages")
      .select("*")
      .eq("holiday_date", todayStr)
      .limit(1);
    
    if (holidaysError) {
      throw holidaysError;
    }
    
    if (holidays && holidays.length > 0) {
      const holiday = holidays[0];
      return new Response(
        JSON.stringify({
          message: holiday.message_text,
          type: "holiday",
          holidayName: holiday.holiday_name
        } as DashboardMessage),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 3. Check if there are important tasks due today
    const { data: tasks, error: tasksError } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("completed", false)
      .lte("due_date", todayStr)
      .order("priority", { ascending: true })
      .limit(3);
    
    if (tasksError) {
      throw tasksError;
    }
    
    if (tasks && tasks.length > 0) {
      let message = "You have important tasks that need attention today:";
      
      return new Response(
        JSON.stringify({
          message,
          type: "task",
          tasks
        } as DashboardMessage),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 4. Check for upcoming events (within the next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekStr = format(nextWeek, "yyyy-MM-dd");
    
    const { data: upcomingEvents, error: upcomingError } = await supabaseClient
      .from("events")
      .select("*")
      .gt("event_date", todayStr)
      .lte("event_date", nextWeekStr)
      .is("deleted_at", null)
      .eq("completed", false)
      .order("event_date", { ascending: true })
      .limit(1);
    
    if (upcomingError) {
      throw upcomingError;
    }
    
    if (upcomingEvents && upcomingEvents.length > 0) {
      const event = upcomingEvents[0];
      const eventDate = new Date(event.event_date);
      const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const dayText = daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`;
      
      let message = `You have an upcoming event ${dayText}: ${event.name}`;
      
      if (event.event_type === "Wedding" && (event.primary_name || event.secondary_name)) {
        if (event.primary_name && event.secondary_name) {
          message = `You have ${event.primary_name} + ${event.secondary_name}'s Wedding ${dayText}`;
        } else if (event.primary_name) {
          message = `You have ${event.primary_name}'s Wedding ${dayText}`;
        }
      } else if (event.primary_name) {
        message += ` for ${event.primary_name}`;
      }
      
      message += `. Time to finalize preparations!`;
      
      return new Response(
        JSON.stringify({
          message,
          type: "upcoming_event",
          eventDetails: event
        } as DashboardMessage),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 5. Otherwise, return a motivational message
    const { data: motivationalMessages, error: motivationalError } = await supabaseClient
      .from("motivational_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (motivationalError) {
      throw motivationalError;
    }
    
    if (motivationalMessages && motivationalMessages.length > 0) {
      // Select a random motivational message
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      const message = motivationalMessages[randomIndex];
      
      return new Response(
        JSON.stringify({
          message: message.message_text,
          type: "motivational"
        } as DashboardMessage),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    // If all else fails, return a default message
    return new Response(
      JSON.stringify({
        message: "Welcome to your dashboard. Have a productive day!",
        type: "default"
      } as DashboardMessage),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating dashboard message:", error);
    return new Response(
      JSON.stringify({
        message: "Welcome to your dashboard. Have a great day!",
        type: "default"
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
