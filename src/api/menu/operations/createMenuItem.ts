
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemFormData } from "../../types/menuItems";
import { handleError, transformMenuItem, getChoiceValueById, prepareMenuItemData } from "../utils";

/**
 * Creates a new menu item
 */
export const createMenuItem = async (menuItem: MenuItemFormData) => {
  try {
    const choiceData = await getChoiceValueById(menuItem.choice_id);
    const itemToCreate = prepareMenuItemData(menuItem, choiceData);
    
    console.log('Creating menu item with data:', itemToCreate);
    const { data, error } = await supabase
      .from('menu_items')
      .insert(itemToCreate)
      .select()
      .single();
    
    if (error) {
      return handleError(error, 'createMenuItem');
    }
    
    console.log('Created menu item:', data);
    return transformMenuItem(data);
  } catch (error) {
    return handleError(error, 'createMenuItem');
  }
};
