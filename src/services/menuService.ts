
import { supabase, retryOperation } from "@/integrations/supabase/client";

export const updateMenuSelection = async (eventCode: string, updates: any) => {
  try {
    console.log('Saving menu selection for event:', eventCode, 'with data:', JSON.stringify(updates, null, 2));
    
    if (!eventCode) {
      throw new Error('Event code is required');
    }
    
    // Ensure all array properties are properly initialized
    const processedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      // If the value should be an array but is null/undefined, initialize it as empty array
      if (value === null && (
        key.includes('selections') || 
        key.includes('_selections') || 
        key.includes('canapes') || 
        key.includes('cakes') ||
        key.includes('starch_selection') ||
        key.includes('vegetable_selections')
      )) {
        console.log(`Converting null to empty array for ${key}`);
        return { ...acc, [key]: [] };
      }
      return { ...acc, [key]: value };
    }, {});
    
    // Use retry operation for more resilient network requests
    const result = await retryOperation(async () => {
      console.log('Executing Supabase upsert operation for menu with data:', processedUpdates);
      const { data, error } = await supabase
        .from('menu_selections')
        .upsert({
          event_code: eventCode,
          ...processedUpdates
        }, {
          onConflict: 'event_code'  // Ensure we update based on event_code conflict
        })
        .select();

      if (error) {
        console.error('Error updating menu selection:', error);
        throw error;
      }
      
      console.log('Menu selection successfully saved to database:', data);
      return data;
    }, 3, 1000); // 3 retries with 1s base delay
    
    return result;
  } catch (error: any) {
    console.error('Error updating menu selection:', error.message || error);
    throw error;
  }
};

export const getMenuSelection = async (eventCode: string) => {
  try {
    console.log(`Fetching menu selection for event: ${eventCode}`);
    
    if (!eventCode) {
      throw new Error('Event code is required');
    }
    
    // Use retry operation for more resilient network requests
    return await retryOperation(async () => {
      const { data, error } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', eventCode)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching menu selection:', error);
        throw error;
      }
      
      console.log('Menu selection fetched:', data);
      return data;
    }, 3, 1000); // 3 retries with 1s base delay
  } catch (error: any) {
    console.error('Error fetching menu selection:', error.message || error);
    throw error;
  }
};
