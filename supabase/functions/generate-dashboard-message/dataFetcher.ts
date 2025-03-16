
import { format } from "https://esm.sh/date-fns@2.30.0";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";

/**
 * Fetches events scheduled for today
 */
export const fetchTodayEvents = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  console.log(`Fetching events for today: ${todayStr}`);
  
  try {
    const { data, error } = await supabaseClient
      .from("events")
      .select("*")
      .eq("event_date", todayStr)
      .is("deleted_at", null)
      .eq("completed", false)
      .order("start_time", { ascending: true })
      .limit(1);
    
    if (error) {
      console.error("Error fetching today's events:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchTodayEvents:", error);
    return [];
  }
};

/**
 * Fetches important tasks due today
 */
export const fetchTasks = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  console.log(`Fetching tasks for today: ${todayStr}`);
  
  try {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("completed", false)
      .lte("due_date", todayStr)
      .order("priority", { ascending: true })
      .limit(3);
    
    if (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    return [];
  }
};

/**
 * Fetches upcoming events within the next week
 */
export const fetchUpcomingEvents = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekStr = format(nextWeek, "yyyy-MM-dd");
  
  console.log(`Fetching upcoming events from ${todayStr} to ${nextWeekStr}`);
  
  try {
    const { data, error } = await supabaseClient
      .from("events")
      .select("*")
      .gt("event_date", todayStr)
      .lte("event_date", nextWeekStr)
      .is("deleted_at", null)
      .eq("completed", false)
      .order("event_date", { ascending: true })
      .limit(1);
    
    if (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchUpcomingEvents:", error);
    return [];
  }
};

/**
 * Fetches tomorrow's weather forecast using a weather API
 */
export const fetchWeatherForecast = async () => {
  try {
    console.log("Attempting to fetch weather forecast");
    
    // Get API key with error handling
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    if (!apiKey) {
      console.error("OpenWeather API key not found in environment variables");
      // Return mock weather data for testing when API key is missing
      console.log("Using mock weather data since API key is missing");
      return {
        date: format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd"),
        temp: 28,
        feels_like: 30,
        humidity: 65,
        wind_speed: 12,
        condition: "Clouds",
        description: "partly cloudy",
        icon: "03d"
      };
    }
    
    // Default location for weather (can be improved to use company's address)
    const location = "Cape Town,ZA";
    
    // Get tomorrow's forecast
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = format(tomorrow, "yyyy-MM-dd");
    
    console.log(`Fetching weather for ${location} on ${tomorrowDate}`);
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Weather API returned status: ${response.status}`);
        // Return mock data on error
        return {
          date: tomorrowDate,
          temp: 28,
          feels_like: 30,
          humidity: 65,
          wind_speed: 12,
          condition: "Clouds",
          description: "partly cloudy",
          icon: "03d"
        };
      }
      
      const data = await response.json();
      console.log("Weather API response received:", JSON.stringify(data).substring(0, 200) + "...");
      
      // Find tomorrow's forecast around midday
      const tomorrowMidDay = `${tomorrowDate} 12:00:00`;
      
      // Find the forecast closest to tomorrow midday
      let closestForecast = data.list[0];
      let smallestDiff = Number.MAX_SAFE_INTEGER;
      
      for (const forecast of data.list) {
        const diff = Math.abs(new Date(forecast.dt_txt).getTime() - new Date(tomorrowMidDay).getTime());
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestForecast = forecast;
        }
      }
      
      // Map weather descriptions to more user-friendly terms
      const weatherMapping = {
        'Clear': 'clear skies',
        'Clouds': {
          'few clouds': 'mostly sunny',
          'scattered clouds': 'partly cloudy',
          'broken clouds': 'mostly cloudy',
          'overcast clouds': 'overcast'
        },
        'Rain': {
          'light rain': 'light rain',
          'moderate rain': 'rain',
          'heavy intensity rain': 'heavy rain',
          'default': 'rainy'
        },
        'Drizzle': 'drizzle',
        'Thunderstorm': 'thunderstorms',
        'Snow': 'snow',
        'Mist': 'misty',
        'Fog': 'foggy',
        'Haze': 'hazy'
      };
      
      // Get friendly description
      let friendlyDescription = closestForecast.weather[0].description;
      const mainCondition = closestForecast.weather[0].main;
      
      if (weatherMapping[mainCondition]) {
        if (typeof weatherMapping[mainCondition] === 'object') {
          friendlyDescription = weatherMapping[mainCondition][closestForecast.weather[0].description] || 
                                weatherMapping[mainCondition]['default'] || 
                                closestForecast.weather[0].description;
        } else {
          friendlyDescription = weatherMapping[mainCondition];
        }
      }
      
      // Extract relevant weather data
      console.log("Weather data successfully processed with condition:", mainCondition, "and description:", friendlyDescription);
      return {
        date: tomorrowDate,
        temp: Math.round(closestForecast.main.temp),
        feels_like: Math.round(closestForecast.main.feels_like),
        humidity: closestForecast.main.humidity,
        wind_speed: closestForecast.wind?.speed || 0,
        condition: closestForecast.weather[0].main,
        description: friendlyDescription,
        icon: closestForecast.weather[0].icon
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error("Weather API request timed out");
      } else {
        console.error("Error during weather API request:", error);
      }
      // Return mock data on error
      return {
        date: tomorrowDate,
        temp: 28,
        feels_like: 30,
        humidity: 65,
        wind_speed: 12,
        condition: "Clouds",
        description: "partly cloudy",
        icon: "03d"
      };
    }
  } catch (error) {
    console.error("Error in fetchWeatherForecast:", error);
    // Return mock data on error
    return {
      date: format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd"),
      temp: 28,
      feels_like: 30,
      humidity: 65,
      wind_speed: 12,
      condition: "Clouds",
      description: "partly cloudy",
      icon: "03d"
    };
  }
};
