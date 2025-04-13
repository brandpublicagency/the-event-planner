
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemFormData } from "../types/menuItems";
import { handleError, transformMenuItem, getChoiceValueById, prepareMenuItemData } from "./utils";

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
