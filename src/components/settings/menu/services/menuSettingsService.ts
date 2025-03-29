
import { supabase } from "@/integrations/supabase/client";
import { MenuOption } from "@/hooks/useMenuOptions";

export interface MenuOptionFormData {
  name: string;
  type: string;
  category: string;
}

export const createMenuOption = async (optionData: MenuOptionFormData) => {
  console.log('Creating menu option:', optionData);
  
  const { data, error } = await supabase
    .from('menu_options')
    .insert({
      name: optionData.name,
      type: optionData.type,
      category: optionData.category,
      price_type: 'standard'
    })
    .select();

  if (error) {
    console.error('Failed to create menu option:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No data returned after creating menu option');
  }

  return transformDbOptionToMenuOption(data[0]);
};

export const updateMenuOption = async (id: string, updates: { name: string; type: string }) => {
  console.log('Updating menu option:', id, updates);
  
  const { error } = await supabase
    .from('menu_options')
    .update({
      name: updates.name,
      type: updates.type
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update menu option:', error);
    throw error;
  }

  return true;
};

export const deleteMenuOption = async (id: string) => {
  console.log('Deleting menu option:', id);
  
  const { error } = await supabase
    .from('menu_options')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete menu option:', error);
    throw error;
  }

  return true;
};

// Helper function to transform database record to MenuOption format
const transformDbOptionToMenuOption = (dbRecord: any): MenuOption => {
  return {
    id: dbRecord.id,
    value: dbRecord.type,
    label: dbRecord.name,
    category: dbRecord.category
  };
};
