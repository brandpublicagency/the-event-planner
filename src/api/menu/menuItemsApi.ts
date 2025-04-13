
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemFormData } from "../types/menuItems";

export const fetchMenuItems = async () => {
  try {
    console.log('Fetching all menu items');
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('display_order', { ascending: true })
      .order('label', { ascending: true });
    
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    const menuItems: MenuItem[] = data.map((item: any) => ({
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
    }));
    
    return menuItems;
  } catch (error) {
    console.error('Error in fetchMenuItems:', error);
    throw error;
  }
};

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
      console.error('Error fetching menu items by choice:', error);
      throw error;
    }
    
    const menuItems: MenuItem[] = data.map((item: any) => ({
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
    }));
    
    return menuItems;
  } catch (error) {
    console.error('Error in fetchMenuItemsByChoice:', error);
    throw error;
  }
};

export const createMenuItem = async (menuItem: MenuItemFormData) => {
  try {
    const { data: choiceData, error: choiceError } = await supabase
      .from('menu_choices')
      .select('*')
      .eq('id', menuItem.choice_id)
      .single();
    
    if (choiceError) {
      console.error('Error fetching choice for menu item:', choiceError);
      throw choiceError;
    }
    
    const itemToCreate = {
      value: menuItem.value,
      label: menuItem.label,
      category: menuItem.category,
      choice_id: menuItem.choice_id,
      choice: choiceData.value,
      display_order: menuItem.display_order || 0
    };

    console.log('Creating menu item with data:', itemToCreate);
    const { data, error } = await supabase
      .from('menu_items')
      .insert(itemToCreate)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
    
    console.log('Created menu item:', data);
    
    const createdItem: MenuItem = {
      id: data.id,
      value: data.value,
      label: data.label,
      category: data.category || null,
      choice_id: data.choice_id,
      choice: data.choice,
      image_url: null,
      display_order: data.display_order || 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return createdItem;
  } catch (error) {
    console.error('Error in createMenuItem:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, menuItem: Partial<MenuItemFormData>) => {
  try {
    console.log(`Updating menu item ${id} with data:`, menuItem);
    
    let itemToUpdate: any = { ...menuItem };
    
    if (menuItem.choice_id) {
      const { data: choiceData, error: choiceError } = await supabase
        .from('menu_choices')
        .select('*')
        .eq('id', menuItem.choice_id)
        .single();
      
      if (choiceError) {
        console.error('Error fetching choice for menu item update:', choiceError);
        throw choiceError;
      }
      
      itemToUpdate.choice = choiceData.value;
    }

    // Explicitly handle null category
    if (menuItem.category === null) {
      itemToUpdate.category = null;
    }

    // Remove image_url from update payload as it no longer exists in the schema
    delete itemToUpdate.image_url;
    
    console.log('Final update payload:', itemToUpdate);
    const { data, error } = await supabase
      .from('menu_items')
      .update(itemToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
    
    console.log('Updated menu item:', data);
    
    const updatedItem: MenuItem = {
      id: data.id,
      value: data.value,
      label: data.label,
      category: data.category || null,
      choice_id: data.choice_id,
      choice: data.choice,
      image_url: null,
      display_order: data.display_order || 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return updatedItem;
  } catch (error) {
    console.error('Error in updateMenuItem:', error);
    throw error;
  }
};

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
      console.error('Error reordering menu items:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in reorderMenuItems:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMenuItem:', error);
    throw error;
  }
};
