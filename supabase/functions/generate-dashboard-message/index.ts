
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { format } from "https://esm.sh/date-fns@2.30.0";
import OpenAI from "https://esm.sh/openai@4.28.0";

interface DashboardMessage {
  message: string;
  type: 'event' | 'holiday' | 'task' | 'upcoming_event' | 'motivational' | 'default';
  eventDetails?: any;
  tasks?: any[];
  holidayName?: string;
}

serve(async (req) => {
  try {
    // Create Supabase client with Auth context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY")!
    });

    // Get today's date
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    
    // Collect context data
    // 1. Check for today's events
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
    
    // 2. Check if today is a holiday
    const { data: holidays, error: holidaysError } = await supabaseClient
      .from("holiday_messages")
      .select("*")
      .eq("holiday_date", todayStr)
      .limit(1);
    
    if (holidaysError) {
      throw holidaysError;
    }
    
    // 3. Check for important tasks due today
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
    
    // 5. Get motivational messages as fallback
    const { data: motivationalMessages, error: motivationalError } = await supabaseClient
      .from("motivational_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (motivationalError) {
      throw motivationalError;
    }

    // Determine message type and prepare content for OpenAI
    let messageType = 'default';
    let contextData = {};
    let systemPrompt = "You are a friendly, supportive assistant for an event planning company. Generate a personalized dashboard greeting message based on the provided context. Keep the tone professional but warm. The message should be concise (1-3 sentences) and focused on the most immediate/important context.";
    
    if (todayEvents && todayEvents.length > 0) {
      messageType = 'event';
      contextData = {
        today_event: todayEvents[0],
        message_type: 'event'
      };
      
      systemPrompt += "\n\nToday there is an event happening. For weddings, emphasize how special the day is for the couple. For other events, emphasize the importance of making the event successful and memorable.";
    } else if (holidays && holidays.length > 0) {
      messageType = 'holiday';
      contextData = {
        holiday: holidays[0],
        message_type: 'holiday'
      };
      
      systemPrompt += "\n\nToday is a holiday. Mention the holiday name and add a brief relevant message for the occasion.";
    } else if (tasks && tasks.length > 0) {
      messageType = 'task';
      contextData = {
        tasks: tasks,
        message_type: 'task'
      };
      
      systemPrompt += "\n\nThere are priority tasks that need attention. Emphasize the importance of completing these tasks.";
    } else if (upcomingEvents && upcomingEvents.length > 0) {
      messageType = 'upcoming_event';
      const event = upcomingEvents[0];
      const eventDate = new Date(event.event_date);
      const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      contextData = {
        upcoming_event: event,
        days_until: daysUntil,
        message_type: 'upcoming_event'
      };
      
      systemPrompt += "\n\nThere is an upcoming event in the next few days. Emphasize preparation and planning for this event.";
    } else if (motivationalMessages && motivationalMessages.length > 0) {
      messageType = 'motivational';
      
      // Select a random motivational message
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      
      contextData = {
        motivational_message: motivationalMessages[randomIndex],
        message_type: 'motivational'
      };
      
      systemPrompt += "\n\nDeliver a motivational message to start the day. Focus on productivity, positivity, and work excellence.";
    } else {
      messageType = 'default';
      contextData = {
        message_type: 'default'
      };
      
      systemPrompt += "\n\nProvide a default welcome message that focuses on having a productive day.";
    }

    // Call OpenAI to generate the personalized message
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(contextData) }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    // Extract the generated message
    const message = completion.choices[0].message.content?.trim() || 
      "Welcome to your dashboard. Have a productive day!";

    // Prepare the response based on message type
    let response: DashboardMessage = {
      message,
      type: messageType as any
    };

    // Add additional details based on message type
    if (messageType === 'event' && todayEvents && todayEvents.length > 0) {
      response.eventDetails = todayEvents[0];
    } else if (messageType === 'holiday' && holidays && holidays.length > 0) {
      response.holidayName = holidays[0].holiday_name;
    } else if (messageType === 'task' && tasks && tasks.length > 0) {
      response.tasks = tasks;
    } else if (messageType === 'upcoming_event' && upcomingEvents && upcomingEvents.length > 0) {
      response.eventDetails = upcomingEvents[0];
    }
    
    return new Response(
      JSON.stringify(response),
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
