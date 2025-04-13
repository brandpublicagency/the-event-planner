
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

    console.log(`Reordering ${updates.length} menu items`);
    
    const { error } = await supabase
      .from('menu_items')
      .upsert(updates, { onConflict: 'id' });
    
    if (error) {
      console.error("Error reordering menu items:", error);
      return handleError(error, 'reorderMenuItems');
    }
    
    console.log("Successfully reordered menu items");
    return true;
  } catch (error) {
    console.error("Exception reordering menu items:", error);
    return handleError(error, 'reorderMenuItems');
  }
};

/**
 * This function is a stub that provides compatibility with previous code.
 * The category order functionality has been removed as we now use fixed category orders.
 */
export const storeCategoryOrder = async (choiceId: string, categoryOrder: string[]) => {
  console.log("Category order storage is no longer necessary as we use fixed orders");
  return true;
};

/**
 * This function is a stub that provides compatibility with previous code.
 * It returns an empty array as we now use fixed category orders defined in the UI code.
 */
export const getCategoryOrder = async (choiceId: string): Promise<string[]> => {
  console.log("Using fixed category orders instead of stored orders");
  return [];
};
