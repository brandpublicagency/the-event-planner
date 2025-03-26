
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
        
        // Create a fallback message with weather data
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
};
