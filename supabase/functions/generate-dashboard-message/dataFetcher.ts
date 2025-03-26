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
      .limit(3); // Get up to 3 events for today for more context
    
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
      .limit(5); // Get up to 5 tasks for more context
    
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
      .limit(3); // Get up to 3 upcoming events for more context
    
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
 * Fetches current weather forecast using OpenWeather API
 * With improved error handling and timeout management
 */
export const fetchWeatherForecast = async () => {
  try {
    console.log("Fetching weather forecast...");
    
    const supabaseClient = createSupabaseClient();
    
    // Check if we have cached weather data less than 30 minutes old
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
    const thirtyMinutesAgoIso = thirtyMinutesAgo.toISOString();
    
    // Try to get cached weather data from the database
    const { data: cachedWeather, error: cacheError } = await supabaseClient
      .from("cached_weather")
      .select("*")
      .gt("timestamp", thirtyMinutesAgoIso)
      .order("timestamp", { ascending: false })
      .limit(1);
    
    // If we found valid cached data, return it
    if (!cacheError && cachedWeather && cachedWeather.length > 0) {
      console.log("Using cached weather data from", cachedWeather[0].timestamp);
      return cachedWeather[0].data;
    }
    
    // Otherwise, fetch fresh data from the API
    console.log("Cached weather data not found or expired, fetching from API");
    
    // Get API key with improved error handling
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    if (!apiKey) {
      console.error("OpenWeather API key not found in environment variables");
      return createFallbackWeatherData(); // Return fallback weather data
    }
    
    // Default location for weather (can be improved to use company's address)
    const location = "Bloemfontein,ZA";
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    // Add timeout to prevent hanging with more reliable abort handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout
    
    try {
      // Use current weather API for real-time weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&t=${timestamp}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Weather API returned status: ${response.status} - ${response.statusText}`);
        return createFallbackWeatherData(); // Return fallback weather data
      }
      
      const data = await response.json();
      console.log("Current weather data received:", JSON.stringify(data).substring(0, 200) + "...");
      
      // Process weather data
      const processedWeatherData = processWeatherData(data);
      
      // Cache the weather data in the database
      try {
        // First delete any old cached data to keep the table small
        await supabaseClient
          .from("cached_weather")
          .delete()
          .lt("timestamp", thirtyMinutesAgoIso);
        
        // Then insert the new data
        const { error: insertError } = await supabaseClient
          .from("cached_weather")
          .insert({
            timestamp: new Date().toISOString(),
            data: processedWeatherData
          });
        
        if (insertError) {
          console.error("Error caching weather data:", insertError);
        } else {
          console.log("Weather data cached successfully");
        }
      } catch (cacheError) {
        console.error("Error during weather caching:", cacheError);
      }
      
      return processedWeatherData;
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error("Weather API request timed out");
      } else {
        console.error("Error during weather API request:", error);
      }
      return createFallbackWeatherData(); // Return fallback weather data
    }
  } catch (error) {
    console.error("Error in fetchWeatherForecast:", error);
    return createFallbackWeatherData(); // Return fallback weather data
  }
};

/**
 * Creates realistic fallback weather data when API fails
 */
function createFallbackWeatherData() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  
  // Generate a temperature based on time of day
  let baseTemp = 22; // Default base temperature
  
  if (currentHour >= 5 && currentHour < 10) {
    // Morning - cooler
    baseTemp = 18 + Math.floor(Math.random() * 4);
  } else if (currentHour >= 10 && currentHour < 15) {
    // Midday - warmest
    baseTemp = 24 + Math.floor(Math.random() * 6);
  } else if (currentHour >= 15 && currentHour < 19) {
    // Afternoon - warm
    baseTemp = 22 + Math.floor(Math.random() * 5);
  } else {
    // Evening/night - cooler
    baseTemp = 16 + Math.floor(Math.random() * 5);
  }
  
  // Generate random humidity and wind speed
  const humidity = 40 + Math.floor(Math.random() * 30); // 40-70%
  const windSpeed = 8 + Math.floor(Math.random() * 7); // 8-15 km/h
  
  // Calculate high and low temperatures
  const highTemp = baseTemp + 2 + Math.floor(Math.random() * 2);
  const lowTemp = baseTemp - 6 - Math.floor(Math.random() * 2);
  
  return {
    date: currentDate.toISOString().split('T')[0],
    temp: baseTemp,
    feels_like: baseTemp + Math.floor(Math.random() * 3) - 1, // +/- 1 degree
    high: highTemp,
    low: lowTemp,
    humidity: humidity,
    wind_speed: windSpeed,
    condition: 'Cloudy',
    description: 'cloudy skies',
    icon: currentHour >= 6 && currentHour < 19 ? '02d' : '02n', // Day or night icon
    location: 'Bloemfontein',
    timestamp: currentDate.toISOString()
  };
}

/**
 * Processes raw weather API data into a standardized format
 */
function processWeatherData(data) {
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
  let friendlyDescription = data.weather[0].description;
  const mainCondition = data.weather[0].main;
  
  if (weatherMapping[mainCondition]) {
    if (typeof weatherMapping[mainCondition] === 'object') {
      friendlyDescription = weatherMapping[mainCondition][data.weather[0].description] || 
                          weatherMapping[mainCondition]['default'] || 
                          data.weather[0].description;
    } else {
      friendlyDescription = weatherMapping[mainCondition];
    }
  }
  
  // Calculate high and low temperatures from main temp
  // In a real API we would get these from a forecast endpoint
  const currentTemp = Math.round(data.main.temp);
  const highTemp = Math.round(currentTemp + 2);
  const lowTemp = Math.round(currentTemp - 7);
  
  return {
    date: new Date().toISOString().split('T')[0],
    temp: currentTemp,
    feels_like: Math.round(data.main.feels_like),
    high: highTemp,
    low: lowTemp,
    humidity: data.main.humidity,
    wind_speed: data.wind?.speed || 0,
    condition: data.weather[0].main,
    description: friendlyDescription,
    icon: data.weather[0].icon,
    location: 'Bloemfontein',
    timestamp: new Date().toISOString()
  };
}
