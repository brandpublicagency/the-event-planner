
import { supabase } from "@/integrations/supabase/client";

export const updateMenuSelection = async (eventCode: string, updates: any) => {
  try {
    console.log('Saving menu selection for event:', eventCode);
    console.log('Menu updates:', JSON.stringify(updates, null, 2));
    
    if (!eventCode) {
      throw new Error('Event code is required');
    }
    
    // Use upsert to either insert a new record or update an existing one
    const { data, error } = await supabase
      .from('menu_selections')
      .upsert({
        event_code: eventCode,
        ...updates
      }, {
        onConflict: 'event_code'  // Ensure we update based on event_code conflict
      })
      .select();

    if (error) {
      console.error('Error updating menu selection:', error);
      throw error;
    }
    
    console.log('Menu selection successfully saved:', data);
    return data;
  } catch (error: any) {
    console.error('Error updating menu selection:', error.message || error);
    throw error;
  }
};

export const getMenuSelection = async (eventCode: string) => {
  try {
    console.log('Fetching menu selection for event:', eventCode);
    
    if (!eventCode) {
      throw new Error('Event code is required');
    }
    
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
  } catch (error: any) {
    console.error('Error fetching menu selection:', error.message || error);
    throw error;
  }
};
