
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

    // Fetch all context data
    const todayEvents = await fetchTodayEvents();
    const tasks = await fetchTasks();
    const upcomingEvents = await fetchUpcomingEvents();
    const weatherData = await fetchWeatherForecast();
    
    // Determine message type and prepare context for OpenAI
    const { messageType, contextData, systemPrompt } = determineMessageContext(
      todayEvents,
      tasks,
      upcomingEvents,
      weatherData
    );
    
    // Generate the personalized message
    const message = await generatePersonalizedMessage(systemPrompt, contextData);
    
    // Prepare the final response
    const response = prepareDashboardResponse(
      message,
      messageType,
      todayEvents,
      tasks,
      upcomingEvents,
      weatherData
    );
    
    return createJsonResponse(response);
  } catch (error) {
    console.error("Error generating dashboard message:", error);
    return createErrorResponse(
      "Welcome to your dashboard. Have a great day!",
      500
    );
  }
});
