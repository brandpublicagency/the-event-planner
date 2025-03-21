
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
        
        // Create a fallback message without weather data
        const fallbackMessage: DashboardMessage = {
          message: `Welcome to your dashboard. Have a pleasant ${getTimeOfDay()}!`,
          type: 'default'
        };
        
        // Use the fallback message instead of throwing an error
        return fallbackMessage;
      }
    },
    // Retry more often and refetch more frequently to ensure we get data
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 3 * 60 * 1000, // 3 minutes
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
