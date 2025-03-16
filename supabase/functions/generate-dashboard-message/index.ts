
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
      console.log("Handling OPTIONS request for CORS preflight");
      return new Response(null, { headers: corsHeaders });
    }

    console.log("Dashboard message request received with method:", req.method);

    // Fetch all context data with better error handling
    let todayEvents = [];
    let tasks = [];
    let upcomingEvents = [];
    let weatherData = null;

    // Check if OpenWeather API key is set
    const openWeatherApiKey = Deno.env.get("OPENWEATHER_API_KEY");
    console.log("OpenWeather API Key configured:", !!openWeatherApiKey);

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

    // Fetch weather data (now with 30-minute caching)
    try {
      weatherData = await fetchWeatherForecast();
      console.log("Weather data fetched:", weatherData ? JSON.stringify(weatherData).substring(0, 100) + "..." : "failed");
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
      console.log("Message generated successfully:", message);
    } catch (error) {
      console.error("Error generating message:", error);
      const timeOfDay = contextData.timeOfDay || "day";
      
      if (weatherData) {
        message = `Welcome to your dashboard. Tomorrow's forecast shows ${weatherData.description} with a high of ${weatherData.temp}°C. Have a pleasant ${timeOfDay}!`;
      } else {
        message = `Welcome to your dashboard. Have a pleasant ${timeOfDay}!`;
      }
      console.log("Using fallback message:", message);
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
    
    console.log("Responding with dashboard message of type:", response.type);
    console.log("Message includes weather data:", !!response.weatherData);
    
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
