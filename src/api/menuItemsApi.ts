
import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  value: string;
  label: string;
  category: string;
  section: string;
  price: number | null;
  available: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type MenuItemFormData = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>;

export const fetchMenuItems = async () => {
  try {
    console.log('Fetching menu items');
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('section, category, label');
    
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    return data as MenuItem[];
  } catch (error) {
    console.error('Error in fetchMenuItems:', error);
    throw error;
  }
};

export const createMenuItem = async (menuItem: MenuItemFormData) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItem)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
    
    return data as MenuItem;
  } catch (error) {
    console.error('Error in createMenuItem:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, menuItem: Partial<MenuItemFormData>) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(menuItem)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
    
    return data as MenuItem;
  } catch (error) {
    console.error('Error in updateMenuItem:', error);
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
