
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemFormData } from "../../types/menuItems";
import { handleError, transformMenuItem, getChoiceValueById, prepareMenuItemData } from "../utils";

/**
 * Updates an existing menu item
 */
export const updateMenuItem = async (id: string, menuItem: Partial<MenuItemFormData>) => {
  try {
    console.log(`Updating menu item ${id} with data:`, menuItem);
    
    let itemToUpdate = { ...menuItem };
    
    if (menuItem.choice_id) {
      const choiceData = await getChoiceValueById(menuItem.choice_id);
      itemToUpdate = prepareMenuItemData(menuItem, choiceData);
    } else {
      itemToUpdate = prepareMenuItemData(menuItem);
    }
    
    console.log('Final update payload:', itemToUpdate);
    const { data, error } = await supabase
      .from('menu_items')
      .update(itemToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return handleError(error, 'updateMenuItem');
    }
    
    console.log('Updated menu item:', data);
    return transformMenuItem(data);
  } catch (error) {
    return handleError(error, 'updateMenuItem');
  }
};
