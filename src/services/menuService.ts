
import { supabase } from "@/integrations/supabase/client";

export const updateMenuSelection = async (eventCode: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('menu_selections')
      .upsert({
        event_code: eventCode,
        ...updates
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating menu selection:', error);
    throw error;
  }
};
