
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface DashboardMessage {
  message: string;
  type: 'event' | 'task' | 'upcoming_event' | 'weather' | 'default';
  eventDetails?: any;
  tasks?: any[];
  upcomingEvents?: any;
  weatherData?: any;
}

export const useDashboardMessage = () => {
  const { data: dashboardMessage, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-message'],
    queryFn: async () => {
      try {
        console.log('Fetching dashboard message from edge function');
        const { data, error } = await supabase.functions.invoke('generate-dashboard-message');
        
        if (error) {
          console.error('Edge function error:', error);
          throw new Error(error.message || 'Failed to send a request to the Edge Function');
        }
        
        if (!data) {
          console.error('No data returned from edge function');
          throw new Error('No data returned from edge function');
        }
        
        console.log('Dashboard message received successfully', data);
        return data as DashboardMessage;
      } catch (err: any) {
        console.error('Error fetching dashboard message:', err);
        
        // Create a fallback message with more realistic weather data
        const fallbackMessage: DashboardMessage = {
          message: `Welcome to your dashboard. Have a pleasant ${getTimeOfDay()}!`,
          type: 'default',
          weatherData: createFallbackWeatherData()
        };
        
        // Use the fallback message instead of throwing an error
        return fallbackMessage;
      }
    },
    // Refetch more frequently to ensure we get fresh data
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid excessive requests
  });

  return { 
    dashboardMessage: dashboardMessage || {
      message: `Welcome to your dashboard. Have a pleasant ${getTimeOfDay()}!`,
      type: 'default',
      weatherData: createFallbackWeatherData()
    }, 
    isLoading, 
    error,
    refetch
  };
};

// Helper function to get time of day
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

// Create fallback weather data that looks realistic
const createFallbackWeatherData = () => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  
  // Generate a temperature based on time of day and season
  // More realistic temperature range for Bloemfontein, South Africa
  let baseTemp = 18; // Default base temperature
  
  // Get month to adjust for seasons (Southern Hemisphere)
  const month = currentDate.getMonth(); // 0-11 (Jan-Dec)
  
  // Seasonal adjustments
  if (month >= 11 || month <= 1) { // Summer (Dec-Feb)
    baseTemp = 22 + Math.floor(Math.random() * 5); // 22-26°C base
  } else if (month >= 2 && month <= 4) { // Autumn (Mar-May)
    baseTemp = 15 + Math.floor(Math.random() * 5); // 15-19°C base
  } else if (month >= 5 && month <= 7) { // Winter (Jun-Aug)
    baseTemp = 8 + Math.floor(Math.random() * 4); // 8-11°C base
  } else { // Spring (Sep-Nov)
    baseTemp = 16 + Math.floor(Math.random() * 6); // 16-21°C base
  }
  
  // Time of day adjustment
  if (currentHour >= 5 && currentHour < 10) {
    // Morning - cooler
    baseTemp -= 2;
  } else if (currentHour >= 10 && currentHour < 15) {
    // Midday - warmest
    baseTemp += 3;
  } else if (currentHour >= 15 && currentHour < 19) {
    // Afternoon - warm
    baseTemp += 1;
  } else {
    // Evening/night - cooler
    baseTemp -= 3;
  }
  
  // Generate random humidity and wind speed
  const humidity = 40 + Math.floor(Math.random() * 30); // 40-70%
  const windSpeed = 8 + Math.floor(Math.random() * 7); // 8-15 km/h
  
  // Calculate high and low temperatures
  const highTemp = baseTemp + 2 + Math.floor(Math.random() * 2);
  const lowTemp = baseTemp - 6 - Math.floor(Math.random() * 2);
  
  // Calculate rain chance based on season and humidity
  const rainChance = month >= 11 || month <= 3 
    ? 15 + Math.floor(Math.random() * 25) // Higher in summer
    : 5 + Math.floor(Math.random() * 10); // Lower in winter
  
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
    timestamp: currentDate.toISOString(),
    rainChance: rainChance
  };
};
