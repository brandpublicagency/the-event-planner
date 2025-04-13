
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles Supabase error logging and rethrowing
 */
export const handleError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  throw error;
};

/**
 * Transforms a menu item by ensuring correct property values
 */
export const transformMenuItem = (item: any) => ({
  id: item.id,
  value: item.value,
  label: item.label,
  category: item.category || null,
  choice_id: item.choice_id,
  choice: item.choice || '',
  image_url: null, // Force null for image_url as it's been removed from the schema
  display_order: item.display_order || 0,
  created_at: item.created_at,
  updated_at: item.updated_at
});

/**
 * Gets the choice value for a given choice ID
 */
export const getChoiceValueById = async (choiceId: string) => {
  try {
    const { data, error } = await supabase
      .from('menu_choices')
      .select('*')
      .eq('id', choiceId)
      .single();
    
    if (error) {
      handleError(error, 'getChoiceValueById');
    }
    
    return data;
  } catch (error) {
    handleError(error, 'getChoiceValueById');
  }
};

/**
 * Prepares menu item data for database operations
 */
export const prepareMenuItemData = (menuItem: any, choiceData?: any) => {
  const itemToUpdate: any = { ...menuItem };
  
  // Remove image_url if present as it no longer exists in the schema
  delete itemToUpdate.image_url;
  
  // Add choice data if available
  if (choiceData) {
    itemToUpdate.choice = choiceData.value;
  }
  
  // Explicitly handle null category
  if (menuItem.category === "no-category") {
    itemToUpdate.category = null;
  }
  
  return itemToUpdate;
};
