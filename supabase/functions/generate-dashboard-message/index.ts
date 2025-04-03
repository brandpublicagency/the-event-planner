
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createJsonResponse, createErrorResponse } from "../_shared/response.ts";
import { fetchWeatherForecast } from "./dataFetcher.ts";
import { getTimeBasedGreeting, prepareDashboardResponse } from "./messageGenerator.ts";

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS request for CORS preflight");
      return new Response(null, { headers: corsHeaders });
    }

    console.log("Dashboard message request received with method:", req.method);

    // Try to parse the request to get the user's name if provided
    let firstName = '';
    try {
      const requestData = await req.json();
      firstName = requestData.firstName || '';
      console.log(`Request included user's first name: ${firstName}`);
    } catch (error) {
      console.log("No request body or not valid JSON, proceeding without user name");
    }

    // Only fetch weather data, skip fetching events and tasks
    let weatherData = null;

    // Check if OpenWeather API key is set
    const openWeatherApiKey = Deno.env.get("OPENWEATHER_API_KEY");
    console.log("OpenWeather API Key configured:", !!openWeatherApiKey);

    // Fetch weather data (with caching)
    try {
      weatherData = await fetchWeatherForecast();
      console.log("Weather data fetched:", weatherData ? JSON.stringify(weatherData).substring(0, 100) + "..." : "failed");
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
    }
    
    // Get the simple time-based greeting
    const message = getTimeBasedGreeting(firstName);
    console.log("Generated time-based greeting:", message);
    
    // Prepare the final response
    const response = prepareDashboardResponse(message, weatherData);
    
    console.log("Responding with dashboard message");
    console.log("Message includes weather data:", !!response.weatherData);
    
    return createJsonResponse(response);
  } catch (error) {
    console.error("Error in dashboard message generation:", error);
    
    // Create a simple fallback greeting based on time
    const hour = new Date().getHours();
    let greeting = "Welcome to your dashboard.";
    
    if (hour >= 3 && hour < 12) {
      greeting = "Good morning,\nWelcome to your dashboard. Have a great day!";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon,\nWelcome to your dashboard. Enjoy the rest of your day.";
    } else {
      greeting = "Good evening,\nWelcome to your dashboard. Enjoy your evening!";
    }
    
    return createErrorResponse(greeting, 500);
  }
});
