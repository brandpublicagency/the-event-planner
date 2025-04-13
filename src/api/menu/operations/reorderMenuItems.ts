
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "../../types/menuItems";
import { handleError } from "../utils";

/**
 * Reorders menu items
 */
export const reorderMenuItems = async (items: MenuItem[]) => {
  try {
    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index,
      value: item.value,
      label: item.label,
      choice: item.choice,
      category: item.category
    }));

    const { error } = await supabase
      .from('menu_items')
      .upsert(updates, { onConflict: 'id' });
    
    if (error) {
      return handleError(error, 'reorderMenuItems');
    }
    
    return true;
  } catch (error) {
    return handleError(error, 'reorderMenuItems');
  }
};
