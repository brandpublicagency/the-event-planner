
import { supabase, retryOperation } from "@/integrations/supabase/client";
import { DashboardMessage } from "./dashboardTypes";
import { createFallbackMessage } from "./createFallbackMessage";

/**
 * Fetches dashboard message from the edge function
 * 
 * @param firstName - User's first name
 * @returns Dashboard message data
 */
export const fetchDashboardMessage = async (firstName: string): Promise<DashboardMessage> => {
  try {
    console.log('Fetching dashboard message from edge function');
    
    // Create a timeout promise to abort the request if it takes too long
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout: Edge function took longer than 10 seconds')), 10000);
    });
    
    // The actual fetch operation
    const fetchPromise = retryOperation(async () => {
      // Pass the user's first name to the edge function
      const { data, error } = await supabase.functions.invoke('generate-dashboard-message', {
        body: { firstName }
      });
      
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
    });
    
    // Race between timeout and fetch - whichever resolves/rejects first wins
    return await Promise.race([fetchPromise, timeoutPromise]) as DashboardMessage;
    
  } catch (err: any) {
    console.error('Error fetching dashboard message:', err);
    
    // Create a fallback message with time-based greeting
    const fallbackMessage = createFallbackMessage(firstName);
    
    // Use the fallback message instead of throwing an error
    return fallbackMessage;
  }
};
