
import { format } from "https://esm.sh/date-fns@2.30.0";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";

/**
 * Fetches events scheduled for today
 */
export const fetchTodayEvents = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .eq("event_date", todayStr)
    .is("deleted_at", null)
    .eq("completed", false)
    .order("start_time", { ascending: true })
    .limit(1);
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Fetches important tasks due today
 */
export const fetchTasks = async () => {
  const supabaseClient = createSupabaseClient();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("completed", false)
    .lte("due_date", todayStr)
    .order("priority", { ascending: true })
    .limit(3);
  
  if (error) {
    throw error;
  }
  
  return data;
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
    throw error;
  }
  
  return data;
};

/**
 * Fetches tomorrow's weather forecast using a weather API
 */
export const fetchWeatherForecast = async () => {
  try {
    // Get company location - default to Cape Town if not found
    const supabaseClient = createSupabaseClient();
    const { data: profiles } = await supabaseClient
      .from("profiles")
      .select("*")
      .limit(1);
    
    // Default location for weather (can be improved to use company's address)
    const location = "Cape Town,ZA";
    
    // OpenWeatherMap API
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY") || "";
    if (!apiKey) {
      console.log("OpenWeather API key not found");
      return null;
    }
    
    // Get tomorrow's forecast
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Find tomorrow's forecast around midday
    const tomorrowDate = format(tomorrow, "yyyy-MM-dd");
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
    
    // Extract relevant weather data
    return {
      date: tomorrowDate,
      temp: Math.round(closestForecast.main.temp),
      feels_like: Math.round(closestForecast.main.feels_like),
      humidity: closestForecast.main.humidity,
      wind_speed: closestForecast.wind?.speed || 0,
      condition: closestForecast.weather[0].main,
      description: closestForecast.weather[0].description,
      icon: closestForecast.weather[0].icon
    };
    
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    return null;
  }
};
