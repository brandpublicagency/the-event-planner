
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://esm.sh/date-fns@2.30.0";

export interface DashboardMessage {
  message: string;
  type: 'event' | 'holiday' | 'task' | 'upcoming_event' | 'motivational' | 'default';
  eventDetails?: any;
  tasks?: any[];
  holidayName?: string;
}

/**
 * Determines the message type and context based on fetched data
 */
export const determineMessageContext = (
  todayEvents: any[], 
  holidays: any[], 
  tasks: any[], 
  upcomingEvents: any[],
  motivationalMessages: any[]
) => {
  const today = new Date();
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

  return { messageType, contextData, systemPrompt };
};

/**
 * Generates personalized message using OpenAI
 */
export const generatePersonalizedMessage = async (
  systemPrompt: string, 
  contextData: any
) => {
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY")!
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(contextData) }
    ],
    temperature: 0.7,
    max_tokens: 150
  });

  return completion.choices[0].message.content?.trim() || 
    "Welcome to your dashboard. Have a productive day!";
};

/**
 * Prepares the final dashboard message response
 */
export const prepareDashboardResponse = (
  message: string,
  messageType: string,
  todayEvents: any[],
  holidays: any[],
  tasks: any[],
  upcomingEvents: any[]
): DashboardMessage => {
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
  
  return response;
};
