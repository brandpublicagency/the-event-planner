
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

/**
 * Stores the preferred category order for a choice
 */
export const storeCategoryOrder = async (choiceId: string, categoryOrder: string[]) => {
  try {
    // Skip if no categories to store
    if (!categoryOrder.length || !choiceId) {
      return false;
    }

    // Store the category order in the database
    const { error } = await supabase
      .from('menu_choice_category_order')
      .upsert(
        { 
          choice_id: choiceId, 
          category_order: categoryOrder 
        },
        { onConflict: 'choice_id' }
      );
    
    if (error) {
      return handleError(error, 'storeCategoryOrder');
    }
    
    return true;
  } catch (error) {
    return handleError(error, 'storeCategoryOrder');
  }
};

/**
 * Retrieves the saved category order for a choice
 */
export const getCategoryOrder = async (choiceId: string): Promise<string[]> => {
  try {
    if (!choiceId) return [];

    const { data, error } = await supabase
      .from('menu_choice_category_order')
      .select('category_order')
      .eq('choice_id', choiceId)
      .maybeSingle();
    
    if (error) {
      handleError(error, 'getCategoryOrder');
      return [];
    }
    
    return data?.category_order || [];
  } catch (error) {
    handleError(error, 'getCategoryOrder');
    return [];
  }
};
