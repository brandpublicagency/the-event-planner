
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface DashboardMessage {
  message: string;
  type: 'event' | 'holiday' | 'task' | 'upcoming_event' | 'motivational' | 'ai_generated' | 'default';
  eventDetails?: any;
  tasks?: any[];
  holidayName?: string;
}

export const useDashboardMessage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardMessage, setDashboardMessage] = useState<DashboardMessage | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.functions.invoke('generate-dashboard-message');
        
        if (error) {
          throw new Error(error.message);
        }
        
        setDashboardMessage(data as DashboardMessage);
      } catch (err: any) {
        console.error('Error fetching dashboard message:', err);
        setError(err);
        // Set a fallback message
        setDashboardMessage({
          message: 'Welcome to your dashboard. Have a great day!',
          type: 'default'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
    
    // Refresh the message every hour
    const intervalId = setInterval(fetchMessage, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { dashboardMessage, isLoading, error };
};
