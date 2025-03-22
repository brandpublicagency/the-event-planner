
import { supabase } from "@/integrations/supabase/client";

export const updateMenuSelection = async (eventCode: string, updates: any) => {
  try {
    console.log('Saving menu selection for event:', eventCode);
    console.log('Menu updates:', updates);
    
    const { data, error } = await supabase
      .from('menu_selections')
      .upsert({
        event_code: eventCode,
        ...updates
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating menu selection:', error);
      throw error;
    }
    
    console.log('Menu selection successfully saved:', data);
    return data;
  } catch (error: any) {
    console.error('Error updating menu selection:', error);
    throw error;
  }
};
