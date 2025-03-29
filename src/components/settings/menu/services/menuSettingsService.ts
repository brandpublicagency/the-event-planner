
import { supabase } from "@/integrations/supabase/client";
import { MenuOption } from "@/hooks/useMenuOptions";
import { toast } from "@/hooks/use-toast";

export interface MenuOptionFormData {
  name: string;
  type: string;
  category: string;
}

/**
 * Creates a new menu option in the database
 * @param optionData The menu option data to create
 * @returns The created menu option
 */
export const createMenuOption = async (optionData: MenuOptionFormData) => {
  console.log('Creating menu option:', optionData);
  
  try {
    if (!optionData.name || !optionData.type || !optionData.category) {
      const error = new Error('Missing required fields for menu option');
      console.error(error);
      throw error;
    }
    
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
      console.error('Supabase error creating menu option:', error);
      throw new Error(`Failed to create menu option: ${error.message}`);
    }

    if (!data || data.length === 0) {
      const error = new Error('No data returned after creating menu option');
      console.error(error);
      throw error;
    }

    console.log('Menu option created successfully:', data[0]);
    return transformDbOptionToMenuOption(data[0]);
  } catch (error: any) {
    console.error('Error in createMenuOption:', error);
    // Show a toast notification for the error
    toast.error('Failed to create menu option', {
      description: error.message || 'An unexpected error occurred'
    });
    throw error;
  }
};

/**
 * Updates an existing menu option in the database
 * @param id The ID of the menu option to update
 * @param updates The fields to update
 * @returns A boolean indicating if the update was successful
 */
export const updateMenuOption = async (id: string, updates: { name: string; type: string }) => {
  console.log('Updating menu option:', id, updates);
  
  try {
    if (!id) {
      const error = new Error('Menu option ID is required for updates');
      console.error(error);
      throw error;
    }
    
    if (!updates.name || !updates.type) {
      const error = new Error('Name and type are required fields for menu option updates');
      console.error(error);
      throw error;
    }
    
    const { error } = await supabase
      .from('menu_options')
      .update({
        name: updates.name,
        type: updates.type
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase error updating menu option:', error);
      throw new Error(`Failed to update menu option: ${error.message}`);
    }

    console.log('Menu option updated successfully:', id);
    return true;
  } catch (error: any) {
    console.error('Error in updateMenuOption:', error);
    // Show a toast notification for the error
    toast.error('Failed to update menu option', {
      description: error.message || 'An unexpected error occurred'
    });
    throw error;
  }
};

/**
 * Deletes a menu option from the database
 * @param id The ID of the menu option to delete
 * @returns A boolean indicating if the deletion was successful
 */
export const deleteMenuOption = async (id: string) => {
  console.log('Deleting menu option:', id);
  
  try {
    if (!id) {
      const error = new Error('Menu option ID is required for deletion');
      console.error(error);
      throw error;
    }
    
    const { error } = await supabase
      .from('menu_options')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting menu option:', error);
      throw new Error(`Failed to delete menu option: ${error.message}`);
    }

    console.log('Menu option deleted successfully:', id);
    return true;
  } catch (error: any) {
    console.error('Error in deleteMenuOption:', error);
    // Show a toast notification for the error
    toast.error('Failed to delete menu option', {
      description: error.message || 'An unexpected error occurred'
    });
    throw error;
  }
};

/**
 * Fetches menu options from the database by category
 * @param category The category of menu options to fetch
 * @returns An array of menu options
 */
export const fetchMenuOptionsByCategory = async (category: string): Promise<MenuOption[]> => {
  console.log(`Fetching menu options for category: ${category}`);
  
  try {
    if (!category) {
      const error = new Error('Category is required to fetch menu options');
      console.error(error);
      throw error;
    }
    
    const { data, error } = await supabase
      .from('menu_options')
      .select('*')
      .eq('category', category)
      .order('name');
        
    if (error) {
      console.error('Supabase error fetching menu options:', error);
      throw new Error(`Failed to fetch menu options: ${error.message}`);
    }
    
    console.log(`Retrieved ${data?.length || 0} options for ${category}`);
    return data.map(transformDbOptionToMenuOption);
  } catch (error: any) {
    console.error('Error in fetchMenuOptionsByCategory:', error);
    // Show a toast notification for the error
    toast.error('Failed to fetch menu options', {
      description: error.message || 'An unexpected error occurred'
    });
    throw error;
  }
};

/**
 * Helper function to transform database record to MenuOption format
 * @param dbRecord The database record to transform
 * @returns The transformed MenuOption
 */
const transformDbOptionToMenuOption = (dbRecord: any): MenuOption => {
  if (!dbRecord) {
    console.error('Attempted to transform a null or undefined database record');
    throw new Error('Invalid database record provided for transformation');
  }
  
  try {
    return {
      id: dbRecord.id,
      value: dbRecord.type,
      label: dbRecord.name,
      category: dbRecord.category
    };
  } catch (error: any) {
    console.error('Error transforming DB record to MenuOption:', error, 'Record:', dbRecord);
    throw new Error(`Failed to transform menu option: ${error.message}`);
  }
};
