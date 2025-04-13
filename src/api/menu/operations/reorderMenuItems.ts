
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

    console.log(`Storing category order for choice ${choiceId}:`, categoryOrder);

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
      console.error("Error storing category order:", error);
      return handleError(error, 'storeCategoryOrder');
    }
    
    console.log("Category order stored successfully");
    return true;
  } catch (error) {
    console.error("Exception storing category order:", error);
    return handleError(error, 'storeCategoryOrder');
  }
};

/**
 * Retrieves the saved category order for a choice
 */
export const getCategoryOrder = async (choiceId: string): Promise<string[]> => {
  try {
    if (!choiceId) return [];

    console.log(`Retrieving category order for choice: ${choiceId}`);

    const { data, error } = await supabase
      .from('menu_choice_category_order')
      .select('category_order')
      .eq('choice_id', choiceId)
      .maybeSingle();
    
    if (error) {
      console.error("Error retrieving category order:", error);
      handleError(error, 'getCategoryOrder');
      return [];
    }
    
    if (data && data.category_order) {
      console.log(`Found category order for choice ${choiceId}:`, data.category_order);
      return data.category_order;
    }
    
    console.log(`No category order found for choice ${choiceId}`);
    return [];
  } catch (error) {
    console.error("Exception retrieving category order:", error);
    handleError(error, 'getCategoryOrder');
    return [];
  }
};
