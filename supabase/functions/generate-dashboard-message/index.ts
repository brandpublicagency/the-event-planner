import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

// Initialize OpenAI
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const openai = new OpenAI({
  apiKey: openAIApiKey
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");
    
    // Step 1: Check for events happening today
    const { data: todayEvents, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('event_date', formattedDate)
      .is('deleted_at', null)
      .order('start_time', { ascending: true });
    
    if (eventsError) throw eventsError;

    // If there's an event today, generate an event-specific message
    if (todayEvents && todayEvents.length > 0) {
      const eventToday = todayEvents[0]; // Use the first event if multiple exist
      let messageContext = '';
      
      if (eventToday.event_type === 'Wedding') {
        const primaryName = eventToday.primary_name || 'the couple';
        const secondaryName = eventToday.secondary_name || '';
        
        if (secondaryName) {
          messageContext = `Today is ${eventToday.name} for ${primaryName} and ${secondaryName}! This is their big day, and you are part of making it unforgettable. Good luck and give it your all!`;
        } else {
          messageContext = `Today is ${eventToday.name} for ${primaryName}! This is their special day, and you are part of making it unforgettable. Good luck and give it your all!`;
        }
      } else {
        const clientName = eventToday.primary_name || 'the client';
        messageContext = `Today is ${eventToday.name} for ${clientName}! This is an important event, and you are part of making it successful. Good luck and give it your all!`;
      }
      
      return new Response(JSON.stringify({
        message: messageContext,
        type: 'event',
        eventDetails: eventToday
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Step 2: Check if today is a holiday
    const { data: holidayData, error: holidayError } = await supabase
      .from('holiday_messages')
      .select('*')
      .eq('holiday_date', formattedDate)
      .limit(1);
    
    if (holidayError) throw holidayError;
    
    if (holidayData && holidayData.length > 0) {
      return new Response(JSON.stringify({
        message: holidayData[0].message_text,
        type: 'holiday',
        holidayName: holidayData[0].holiday_name
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Step 3: Check for important tasks due today or soon
    const { data: dueTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false)
      .lte('due_date', new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString()) // Tasks due within 2 days
      .order('due_date', { ascending: true })
      .limit(3);
    
    if (tasksError) throw tasksError;
    
    if (dueTasks && dueTasks.length > 0) {
      // If there are high priority tasks, highlight those
      const highPriorityTasks = dueTasks.filter(task => task.priority === 'high');
      
      if (highPriorityTasks.length > 0) {
        const taskNames = highPriorityTasks.map(task => task.title).join(', ');
        return new Response(JSON.stringify({
          message: `Reminder: You have important tasks that need attention: ${taskNames}. Make sure to prioritize these today.`,
          type: 'task',
          tasks: highPriorityTasks
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Otherwise mention any upcoming tasks
      const taskNames = dueTasks.map(task => task.title).join(', ');
      return new Response(JSON.stringify({
        message: `You have upcoming tasks due soon: ${taskNames}. Stay on top of your schedule.`,
        type: 'task',
        tasks: dueTasks
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Step 4: Check for upcoming events in the next 7 days
    const nextWeek = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    const formattedNextWeek = format(nextWeek, "yyyy-MM-dd");
    
    const { data: upcomingEvents, error: upcomingError } = await supabase
      .from('events')
      .select('*')
      .gt('event_date', formattedDate)
      .lte('event_date', formattedNextWeek)
      .is('deleted_at', null)
      .order('event_date', { ascending: true });
    
    if (upcomingError) throw upcomingError;
    
    if (upcomingEvents && upcomingEvents.length > 0) {
      const nextEvent = upcomingEvents[0];
      const eventDate = new Date(nextEvent.event_date);
      const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const dayText = daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`;
      
      return new Response(JSON.stringify({
        message: `Your next event, ${nextEvent.name}, is coming up ${dayText}. Now is a good time to review the preparations.`,
        type: 'upcoming_event',
        eventDetails: nextEvent
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Step 5: Get a random motivational message if nothing else applies
    const { data: motivationalMessages, error: motivationalError } = await supabase
      .from('motivational_messages')
      .select('*');
    
    if (motivationalError) throw motivationalError;
    
    if (motivationalMessages && motivationalMessages.length > 0) {
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
      return new Response(JSON.stringify({
        message: motivationalMessages[randomIndex].message_text,
        type: 'motivational'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Fallback to OpenAI generated message if no predefined messages are found
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are an assistant helping to generate a positive, motivational message for an event planning dashboard. Keep it short (1-2 sentences), professional, and focused on productivity."
          },
          { 
            role: "user", 
            content: "Generate a short, positive message for an event planner who has no events today."
          }
        ]
      });
      
      const generatedMessage = completion.choices[0].message.content;
      
      return new Response(JSON.stringify({
        message: generatedMessage,
        type: 'ai_generated'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (aiError) {
      console.error('Error generating AI message:', aiError);
      
      // Default fallback message if OpenAI fails
      return new Response(JSON.stringify({
        message: "No events scheduled today. A great day to catch up on planning and preparation for upcoming events.",
        type: 'default'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Error in generate-dashboard-message function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "Welcome to your dashboard. Have a productive day!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
