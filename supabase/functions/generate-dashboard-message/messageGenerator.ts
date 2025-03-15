
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
  let systemPrompt = "You are a friendly, supportive assistant for an event planning company called Warmkaroo. Generate a personalized dashboard greeting message that sounds conversational and engaging. Make the user feel seen and supported in their day. Keep the tone friendly, warm, and slightly informal. The message should be concise (1-3 sentences) and focused on the most immediate/important context.";
    
  if (todayEvents && todayEvents.length > 0) {
    messageType = 'event';
    const event = todayEvents[0];
    
    contextData = {
      today_event: event,
      message_type: 'event',
      time_of_day: getTimeOfDay(),
      event_details: {
        name: event.name,
        type: event.event_type,
        venue: event.venues && event.venues.length > 0 ? event.venues.join(', ') : 'Not specified',
        start_time: event.start_time ? formatTime(event.start_time) : 'Not specified',
        pax: event.pax || 'Not specified',
        client_name: event.primary_name || 'the client'
      }
    };
    
    systemPrompt += "\n\nToday there is an event happening that requires attention. For weddings, mention the couple's names (if available) and express excitement about their special day. For corporate events, emphasize professionalism and readiness. For other events, highlight the importance of making the event successful and memorable for the client. Mention specific details like the event name, venue, start time, or number of guests to make the message feel personalized. Convey a sense of excitement and readiness.";
  } else if (holidays && holidays.length > 0) {
    messageType = 'holiday';
    const holiday = holidays[0];
    
    contextData = {
      holiday: holiday,
      message_type: 'holiday',
      time_of_day: getTimeOfDay(),
      holiday_details: {
        name: holiday.holiday_name,
        message: holiday.message_text
      }
    };
    
    systemPrompt += "\n\nToday is a holiday. Mention the holiday name specifically and add a brief relevant message for the occasion. Make it festive and celebratory while acknowledging that the user might still be checking their dashboard on a holiday. Express appreciation for their dedication.";
  } else if (tasks && tasks.length > 0) {
    messageType = 'task';
    
    // Format task details for better prompting
    const taskDetails = tasks.map(task => ({
      title: task.title,
      priority: task.priority || 'medium',
      due_date: task.due_date ? format(new Date(task.due_date), 'EEEE, MMMM d') : 'today',
      is_overdue: task.due_date && new Date(task.due_date) < today
    }));
    
    contextData = {
      tasks: tasks,
      message_type: 'task',
      time_of_day: getTimeOfDay(),
      task_count: tasks.length,
      task_details: taskDetails,
      highest_priority: getHighestPriority(tasks)
    };
    
    systemPrompt += "\n\nThere are priority tasks that need attention. Mention how many tasks are pending and emphasize the importance of the highest priority ones. If any tasks are overdue, gently emphasize their urgency without sounding demanding. Be encouraging and supportive, suggesting that tackling these tasks will lead to a more productive day. Mention a specific task by name to make the message feel more personalized.";
  } else if (upcomingEvents && upcomingEvents.length > 0) {
    messageType = 'upcoming_event';
    const event = upcomingEvents[0];
    const eventDate = new Date(event.event_date);
    const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const formattedDate = format(eventDate, 'EEEE, MMMM d');
    
    contextData = {
      upcoming_event: event,
      days_until: daysUntil,
      message_type: 'upcoming_event',
      time_of_day: getTimeOfDay(),
      event_details: {
        name: event.name,
        type: event.event_type,
        date: formattedDate,
        days_away: daysUntil,
        venue: event.venues && event.venues.length > 0 ? event.venues.join(', ') : 'Not specified',
        client_name: event.primary_name || 'the client',
        pax: event.pax || 'Not specified'
      }
    };
    
    systemPrompt += "\n\nThere is an upcoming event in the next few days. Emphasize preparation and planning for this specific event. Mention the event by name, the exact date, and how many days away it is to create a sense of timeline. If it's very soon (1-2 days away), create a sense of gentle urgency. Suggest that early preparation will lead to a successful event. Mention specific details like the venue or client name to make the message feel personalized.";
  } else if (motivationalMessages && motivationalMessages.length > 0) {
    messageType = 'motivational';
    
    // Select a random motivational message
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    const message = motivationalMessages[randomIndex];
    
    contextData = {
      motivational_message: message,
      message_type: 'motivational',
      time_of_day: getTimeOfDay(),
      day_of_week: format(today, 'EEEE')
    };
    
    systemPrompt += "\n\nDeliver a motivational message to start the day. Acknowledge the current day of the week and time of day to make it feel relevant to the moment. Focus on productivity, positivity, and work excellence specific to event planning. For Mondays, emphasize fresh starts; for Fridays, acknowledge the upcoming weekend while maintaining focus; for other days, focus on momentum and progress. Make the message inspiring but realistic, avoiding clichés.";
  } else {
    messageType = 'default';
    contextData = {
      message_type: 'default',
      time_of_day: getTimeOfDay(),
      day_of_week: format(today, 'EEEE'),
      date: format(today, 'MMMM d, yyyy')
    };
    
    systemPrompt += "\n\nProvide a default welcome message that acknowledges the specific day and date. Focus on having a productive day in event planning. Suggest that even a day without specific events or tasks can be valuable for planning, preparation, or professional development. Be positive and forward-looking, encouraging the user to make the most of their day.";
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

/**
 * Helper function to get time of day greeting
 */
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

/**
 * Helper function to get highest priority from tasks
 */
const getHighestPriority = (tasks: any[]) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  let highestPriority = "low";
  
  tasks.forEach(task => {
    if (task.priority && priorityOrder[task.priority as keyof typeof priorityOrder] > priorityOrder[highestPriority as keyof typeof priorityOrder]) {
      highestPriority = task.priority;
    }
  });
  
  return highestPriority;
};

/**
 * Helper function to format time
 */
const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  
  // Handle HH:MM:SS format
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':');
    const hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? 'PM' : 'AM';
    const hours12 = hoursNum % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  }
  
  return timeStr;
};
