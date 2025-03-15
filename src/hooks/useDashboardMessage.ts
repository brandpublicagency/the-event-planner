
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface DashboardMessage {
  message: string;
  type: 'event' | 'holiday' | 'task' | 'upcoming_event' | 'motivational' | 'default';
  eventDetails?: any;
  tasks?: any[];
  holidayName?: string;
}

export const useDashboardMessage = () => {
  const { data: dashboardMessage, isLoading, error } = useQuery({
    queryKey: ['dashboard-message'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-dashboard-message');
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data as DashboardMessage;
      } catch (err: any) {
        console.error('Error fetching dashboard message:', err);
        throw err;
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });

  return { 
    dashboardMessage: dashboardMessage || {
      message: 'Welcome to your dashboard. Have a great day!',
      type: 'default'
    }, 
    isLoading, 
    error 
  };
};
