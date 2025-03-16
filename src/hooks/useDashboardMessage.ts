
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
  const { data: dashboardMessage, isLoading, error } = useQuery({
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
        
        // Get time of day for fallback
        const hour = new Date().getHours();
        let timeOfDay = "day";
        if (hour < 12) timeOfDay = "morning";
        else if (hour < 17) timeOfDay = "afternoon";
        else timeOfDay = "evening";
        
        // Create a fallback message
        const fallbackMessage: DashboardMessage = {
          message: `Welcome to your dashboard. Have a pleasant ${timeOfDay}!`,
          type: 'default'
        };
        
        // Use the fallback message instead of throwing an error
        // This prevents the UI from breaking when the edge function fails
        return fallbackMessage;
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 2, // Retry twice before using fallback
  });

  return { 
    dashboardMessage: dashboardMessage || {
      message: `Welcome to your dashboard. Have a pleasant ${getTimeOfDay()}!`,
      type: 'default'
    }, 
    isLoading, 
    error 
  };
};

// Helper function to get time of day
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};
