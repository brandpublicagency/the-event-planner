
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";

/**
 * Deletes a menu item
 */
export const deleteMenuItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      return handleError(error, 'deleteMenuItem');
    }
    
    return true;
  } catch (error) {
    return handleError(error, 'deleteMenuItem');
  }
};
