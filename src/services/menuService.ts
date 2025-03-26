
import { supabase, retryOperation } from "@/integrations/supabase/client";
import { SaveMenuData } from "@/hooks/menuStateTypes";

export const updateMenuSelection = async (eventCode: string, updates: SaveMenuData) => {
  try {
    console.log(`Starting menu upsert operation for event: ${eventCode}`);
    
    if (!eventCode) {
      throw new Error('Event code is required');
    }
    
    // Validate that event_code is present and matches the parameter
    if (!updates.event_code || updates.event_code !== eventCode) {
      console.warn('Fixing missing or incorrect event_code in updates object');
      updates.event_code = eventCode;
    }
    
    // Create a deep copy of updates to avoid modifying the original
    const processedUpdates = JSON.parse(JSON.stringify(updates)) as SaveMenuData;
    
    // Process arrays to ensure they're properly handled
    for (const [key, value] of Object.entries(processedUpdates)) {
      // If the value is an array, make sure it's properly handled
      if (Array.isArray(value)) {
        console.log(`Processing array field ${key}:`, value);
        
        // Ensure all items in the array are valid
        const filtered = value.filter(item => item !== null && item !== undefined && typeof item === 'string' && item.trim() !== '');
        
        console.log(`After filtering ${key}:`, filtered);
        // Use type assertion to avoid TypeScript error
        (processedUpdates as any)[key] = filtered;
      }
      
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
        // Use type assertion to avoid TypeScript error
        (processedUpdates as any)[key] = [];
      }
    }
    
    // Final validation check for critical fields
    if (processedUpdates.starter_type === 'canapes') {
      console.log('Validating canape selections:', processedUpdates.canape_selections);
      
      if (!Array.isArray(processedUpdates.canape_selections)) {
        console.warn('Canape selections not an array, fixing...');
        processedUpdates.canape_selections = [];
      }
    }
    
    console.log('Executing Supabase upsert operation with data:', JSON.stringify(processedUpdates, null, 2));
    
    // Use retry operation for more resilient network requests
    const result = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('menu_selections')
        .upsert(processedUpdates, {
          onConflict: 'event_code',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('Supabase error updating menu selection:', error);
        throw error;
      }
      
      // Verify the save was successful by fetching the latest data
      const { data: verifyData, error: verifyError } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', eventCode)
        .single();
      
      if (verifyError) {
        console.error('Error verifying saved data:', verifyError);
      } else {
        console.log('Verified saved data:', verifyData);
      }
      
      return data || { success: true };
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
      
      console.log('Menu selection fetched:', data ? 'Data found' : 'No data found');
      if (data && data.canape_selections) {
        console.log('Fetched canape selections:', data.canape_selections);
      }
      
      return data;
    }, 3, 1000); // 3 retries with 1s base delay
  } catch (error: any) {
    console.error('Error fetching menu selection:', error.message || error);
    throw error;
  }
};
