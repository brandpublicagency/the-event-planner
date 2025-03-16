
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://esm.sh/date-fns@2.30.0";

export interface DashboardMessage {
  message: string;
  type: 'event' | 'task' | 'upcoming_event' | 'weather' | 'default';
  eventDetails?: any;
  tasks?: any[];
  upcomingEvents?: any[];
  weatherData?: any;
}

/**
 * Determine the appropriate context for generating the dashboard message
 */
export const determineMessageContext = (
  todayEvents: any[],
  tasks: any[],
  upcomingEvents: any[],
  weatherData: any
) => {
  // Initialize with default message type
  let messageType = 'default';
  let contextData = {};
  
  // Check for events happening today (highest priority)
  if (todayEvents && todayEvents.length > 0) {
    messageType = 'event';
    contextData = {
      event: todayEvents[0],
      weatherData
    };
  }
  // Otherwise check for important tasks (next priority)
  else if (tasks && tasks.length > 0) {
    messageType = 'task';
    contextData = {
      tasks,
      weatherData
    };
  }
  // Otherwise check for upcoming events (third priority)
  else if (upcomingEvents && upcomingEvents.length > 0) {
    messageType = 'upcoming_event';
    contextData = {
      upcomingEvent: upcomingEvents[0],
      weatherData
    };
  }
  // Weather-only message (fourth priority)
  else if (weatherData) {
    messageType = 'weather';
    contextData = {
      weatherData
    };
  }
  // If nothing else, use default message
  else {
    contextData = {
      currentTime: new Date().toISOString()
    };
  }
  
  // Create the system prompt for OpenAI
  const systemPrompt = createSystemPrompt(messageType, contextData);
  
  return { messageType, contextData, systemPrompt };
};

/**
 * Create the system prompt for OpenAI based on the message context
 */
const createSystemPrompt = (messageType: string, contextData: any) => {
  const timeOfDay = getTimeOfDay();
  const basePrompt = `You are an AI assistant for an event planning company. Write a friendly, personalized message for the user's dashboard. Always structure your message in 3 parts:
1. Start with "Welcome to your dashboard."
2. In the middle, include relevant information based on the context below.
3. End with "Have a pleasant ${timeOfDay}!"

Keep the entire message concise (under 150 characters). Don't add any prefixes like 'Good morning' (the UI will handle that).`;
  
  let contextPrompt = "";
  
  switch (messageType) {
    case 'event':
      contextPrompt = `
        Today, there is an event: "${contextData.event.name}" (${contextData.event.event_type}). 
        Mention this event happening today and include a relevant detail like the venue, time, or number of guests (${contextData.event.pax} people).
      `;
      break;
    case 'task':
      contextPrompt = `
        The user has ${contextData.tasks.length} important tasks to complete. 
        Mention the most important task first: "${contextData.tasks[0].title}".
        Encourage the user to stay on top of their tasks.
      `;
      break;
    case 'upcoming_event':
      contextPrompt = `
        The next upcoming event is "${contextData.upcomingEvent.name}" (${contextData.upcomingEvent.event_type}).
        Mention this upcoming event and when it's happening.
      `;
      break;
    case 'weather':
      contextPrompt = `
        Focus on tomorrow's weather forecast: ${contextData.weatherData.description}, temperature: ${contextData.weatherData.temp}°C.
        Provide a weather-appropriate suggestion for tomorrow.
      `;
      break;
    default:
      contextPrompt = `
        Provide a simple, friendly greeting to start the user's day.
      `;
  }
  
  // Always include weather data in all message types
  if (contextData.weatherData && contextData.weatherData.description) {
    if (messageType !== 'weather') {
      contextPrompt += `
        Also, include tomorrow's weather forecast: ${contextData.weatherData.description}, temperature: ${contextData.weatherData.temp}°C.
      `;
    }
  }
  
  return `${basePrompt}\n\n${contextPrompt}`;
};

/**
 * Generate a personalized dashboard message using OpenAI
 */
export const generatePersonalizedMessage = async (systemPrompt: string, contextData: any) => {
  try {
    // Import the OpenAI service dynamically to avoid issues with Deno
    const { getChatCompletion } = await import('../../_shared/openai.ts');
    
    // Generate the message using OpenAI
    const message = await getChatCompletion(systemPrompt);
    
    // If message couldn't be generated, return a fallback with weather if available
    if (!message) {
      const timeOfDay = getTimeOfDay();
      
      if (contextData.weatherData) {
        return `Welcome to your dashboard. Tomorrow's forecast shows ${contextData.weatherData.description} with a high of ${contextData.weatherData.temp}°C. Have a pleasant ${timeOfDay}!`;
      }
      
      return `Welcome to your dashboard. Have a pleasant ${timeOfDay}!`;
    }
    
    return message;
  } catch (error) {
    console.error("Error generating message with OpenAI:", error);
    const timeOfDay = getTimeOfDay();
    
    if (contextData.weatherData) {
      return `Welcome to your dashboard. Tomorrow's forecast shows ${contextData.weatherData.description} with a high of ${contextData.weatherData.temp}°C. Have a pleasant ${timeOfDay}!`;
    }
    
    return `Welcome to your dashboard. Have a pleasant ${timeOfDay}!`;
  }
};

/**
 * Prepare the final dashboard response with all necessary data
 */
export const prepareDashboardResponse = (
  message: string,
  messageType: string,
  todayEvents: any[],
  tasks: any[],
  upcomingEvents: any[],
  weatherData: any
): DashboardMessage => {
  // Base response with message and type
  const response: DashboardMessage = {
    message,
    type: messageType as DashboardMessage['type']
  };
  
  // Add relevant data based on message type
  if (messageType === 'event' && todayEvents?.length > 0) {
    response.eventDetails = todayEvents[0];
  }
  
  if (messageType === 'task' && tasks?.length > 0) {
    response.tasks = tasks;
  }
  
  if (messageType === 'upcoming_event' && upcomingEvents?.length > 0) {
    response.upcomingEvents = upcomingEvents;
  }
  
  if (weatherData) {
    response.weatherData = weatherData;
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
