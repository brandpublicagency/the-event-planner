
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
  console.log("Determining message context with data:", {
    hasEvents: todayEvents?.length > 0,
    hasTasks: tasks?.length > 0,
    hasUpcomingEvents: upcomingEvents?.length > 0,
    hasWeather: !!weatherData
  });
  
  // Initialize with default message type
  let messageType = 'default';
  let contextData: any = {
    timeOfDay: getTimeOfDay(),
    weatherData
  };
  
  // Check for events happening today (highest priority)
  if (todayEvents && todayEvents.length > 0) {
    messageType = 'event';
    contextData.event = todayEvents[0];
  }
  // Otherwise check for important tasks (next priority)
  else if (tasks && tasks.length > 0) {
    messageType = 'task';
    contextData.tasks = tasks;
  }
  // Otherwise check for upcoming events (third priority)
  else if (upcomingEvents && upcomingEvents.length > 0) {
    messageType = 'upcoming_event';
    contextData.upcomingEvent = upcomingEvents[0];
  }
  // Weather-only message (fourth priority)
  else if (weatherData) {
    messageType = 'weather';
  }
  
  // Create the system prompt for OpenAI
  const systemPrompt = createSystemPrompt(messageType, contextData);
  
  console.log(`Message type determined: ${messageType}`);
  return { messageType, contextData, systemPrompt };
};

/**
 * Create the system prompt for OpenAI based on the message context
 */
const createSystemPrompt = (messageType: string, contextData: any) => {
  const timeOfDay = contextData.timeOfDay || getTimeOfDay();
  const basePrompt = `You are an AI assistant for an event planning company. Write a friendly, personalized message for the user's dashboard. Always structure your message in exactly this format:
"Welcome to your dashboard. [SPECIFIC CONTEXT INFORMATION]. Have a pleasant ${timeOfDay}!"

Keep the entire message concise (under 150 characters). Don't add any prefixes like 'Good morning' (the UI will handle that).`;
  
  let contextPrompt = "";
  
  switch (messageType) {
    case 'event':
      contextPrompt = `
        Today, there is an event: "${contextData.event.name}" (${contextData.event.event_type}). 
        Mention this event happening today and include a relevant detail like the venue, time, or number of guests (${contextData.event.pax} people).
        Make the message enthusiastic and action-oriented, since this is happening today.
      `;
      break;
    case 'task':
      contextPrompt = `
        The user has ${contextData.tasks.length} important tasks to complete. 
        Mention the most important task first: "${contextData.tasks[0].title}".
        Use urgent but supportive language to encourage the user to stay on top of their tasks.
      `;
      break;
    case 'upcoming_event':
      const eventDate = new Date(contextData.upcomingEvent.event_date);
      const today = new Date();
      const diffTime = Math.abs(eventDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      contextPrompt = `
        The next upcoming event is "${contextData.upcomingEvent.name}" (${contextData.upcomingEvent.event_type}).
        It's happening in ${diffDays} days on ${format(eventDate, 'EEEE, MMMM d')}.
        Make the message focus on preparation and planning for this upcoming event.
      `;
      break;
    case 'weather':
      contextPrompt = `
        Focus on tomorrow's weather forecast: ${contextData.weatherData.description}, temperature: ${contextData.weatherData.temp}°C.
        Format your message as: "Welcome to your dashboard. Tomorrow's forecast shows [weather description] with a high of [temp]°C. Have a pleasant ${timeOfDay}!"
      `;
      break;
    default:
      contextPrompt = `
        Provide a simple, motivational greeting about planning successful events, and being ready for the day ahead.
        Vary your message with each call - do not use generic statements repeatedly.
        Some examples of context you can use: preparing for success, creating memorable experiences, attention to detail, teamwork, etc.
      `;
  }
  
  // Always include weather data if available
  if (contextData.weatherData && contextData.weatherData.description && messageType !== 'weather') {
    contextPrompt += `
      Also, include tomorrow's weather forecast in this format: 
      "Tomorrow's forecast shows ${contextData.weatherData.description} with a high of ${contextData.weatherData.temp}°C"
    `;
  }
  
  console.log("Creating system prompt for message type:", messageType);
  return `${basePrompt}\n\n${contextPrompt}`;
};

/**
 * Generate a personalized dashboard message using OpenAI
 */
export const generatePersonalizedMessage = async (systemPrompt: string, contextData: any) => {
  try {
    // Import the OpenAI service dynamically to avoid issues with Deno
    const { getChatCompletion } = await import('../../_shared/openai.ts');
    
    console.log("Generating message with OpenAI using prompt:", systemPrompt.substring(0, 150) + "...");
    
    // Generate the message using OpenAI
    const message = await getChatCompletion(systemPrompt);
    
    // If message couldn't be generated, return a fallback with weather if available
    if (!message) {
      console.log("No message received from OpenAI, using fallback");
      const timeOfDay = contextData.timeOfDay || getTimeOfDay();
      
      if (contextData.weatherData) {
        return `Welcome to your dashboard. Tomorrow's forecast shows ${contextData.weatherData.description} with a high of ${contextData.weatherData.temp}°C. Have a pleasant ${timeOfDay}!`;
      }
      
      return `Welcome to your dashboard. Have a pleasant ${timeOfDay}!`;
    }
    
    console.log("Generated message:", message);
    return message;
  } catch (error) {
    console.error("Error generating message with OpenAI:", error);
    const timeOfDay = contextData.timeOfDay || getTimeOfDay();
    
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
  
  // Always include weather data if available
  if (weatherData) {
    response.weatherData = weatherData;
  }
  
  console.log("Prepared dashboard response with message type:", messageType);
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
