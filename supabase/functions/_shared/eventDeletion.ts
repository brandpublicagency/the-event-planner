
import { createSupabaseClient } from "./supabaseClient.ts";

/**
 * Helper function to delete event venues with proper error handling
 */
export const deleteEventVenues = async (eventCode: string): Promise<boolean> => {
  const supabase = createSupabaseClient();
  
  try {
    // Try a direct SQL query approach for tables that might not be in the TypeScript types
    const { error } = await supabase
      .from('event_venues')
      .delete()
      .eq('event_code', eventCode);
    
    if (error) {
      console.error('Error deleting event venues:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error with event venues deletion:', err);
    return false; // Return false but don't throw to prevent stopping the entire deletion process
  }
};
