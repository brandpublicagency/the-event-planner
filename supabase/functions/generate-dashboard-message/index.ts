
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createJsonResponse, createErrorResponse } from "../_shared/response.ts";
import { 
  fetchTodayEvents,
  fetchTasks,
  fetchUpcomingEvents,
  fetchWeatherForecast
} from "./dataFetcher.ts";
import { 
  determineMessageContext,
  generatePersonalizedMessage,
  prepareDashboardResponse,
  type DashboardMessage
} from "./messageGenerator.ts";

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    console.log("Dashboard message request received");

    // Fetch all context data with better error handling
    let todayEvents = [];
    let tasks = [];
    let upcomingEvents = [];
    let weatherData = null;

    try {
      todayEvents = await fetchTodayEvents();
      console.log(`Fetched ${todayEvents.length} today events`);
    } catch (error) {
      console.error("Error fetching today's events:", error);
    }

    try {
      tasks = await fetchTasks();
      console.log(`Fetched ${tasks.length} tasks`);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }

    try {
      upcomingEvents = await fetchUpcomingEvents();
      console.log(`Fetched ${upcomingEvents.length} upcoming events`);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    }

    try {
      weatherData = await fetchWeatherForecast();
      console.log("Weather data fetched:", weatherData ? "success" : "failed");
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
    }
    
    // Determine message type and prepare context for OpenAI
    const { messageType, contextData, systemPrompt } = determineMessageContext(
      todayEvents,
      tasks,
      upcomingEvents,
      weatherData
    );
    
    console.log(`Message type determined: ${messageType}`);
    
    // Generate the personalized message
    let message;
    try {
      message = await generatePersonalizedMessage(systemPrompt, contextData);
      console.log("Message generated successfully");
    } catch (error) {
      console.error("Error generating message:", error);
      const timeOfDay = contextData.timeOfDay || "day";
      
      if (weatherData) {
        message = `Welcome to your dashboard. Tomorrow's forecast shows ${weatherData.description} with a high of ${weatherData.temp}°C. Have a pleasant ${timeOfDay}!`;
      } else {
        message = `Welcome to your dashboard. Have a pleasant ${timeOfDay}!`;
      }
    }
    
    // Prepare the final response
    const response = prepareDashboardResponse(
      message,
      messageType,
      todayEvents,
      tasks,
      upcomingEvents,
      weatherData
    );
    
    console.log("Responding with dashboard message");
    return createJsonResponse(response);
  } catch (error) {
    console.error("Error in dashboard message generation:", error);
    
    // Try to determine time of day for fallback message
    const hour = new Date().getHours();
    let timeOfDay = "day";
    if (hour < 12) timeOfDay = "morning";
    else if (hour < 17) timeOfDay = "afternoon";
    else timeOfDay = "evening";
    
    return createErrorResponse(
      `Welcome to your dashboard. Have a pleasant ${timeOfDay}!`,
      500
    );
  }
});
