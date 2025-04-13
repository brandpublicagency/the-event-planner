
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "../../types/menuItems";
import { handleError, transformMenuItem } from "../utils";

/**
 * Fetches all menu items
 */
export const fetchMenuItems = async () => {
  try {
    console.log('Fetching all menu items');
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('display_order', { ascending: true })
      .order('label', { ascending: true });
    
    if (error) {
      return handleError(error, 'fetchMenuItems');
    }
    
    return data.map(transformMenuItem) as MenuItem[];
  } catch (error) {
    return handleError(error, 'fetchMenuItems');
  }
};

/**
 * Fetches menu items filtered by choice
 */
export const fetchMenuItemsByChoice = async (choiceId: string) => {
  try {
    console.log(`Fetching menu items for choice: ${choiceId}`);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('choice_id', choiceId)
      .order('display_order', { ascending: true })
      .order('category', { ascending: true, nullsFirst: false })
      .order('label', { ascending: true });
    
    if (error) {
      return handleError(error, 'fetchMenuItemsByChoice');
    }
    
    return data.map(transformMenuItem) as MenuItem[];
  } catch (error) {
    return handleError(error, 'fetchMenuItemsByChoice');
  }
};
