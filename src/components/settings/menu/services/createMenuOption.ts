
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
 * Helper function to transform database record to MenuOption format
 * @param dbRecord The database record to transform
 * @returns The transformed MenuOption
 */
export const transformDbOptionToMenuOption = (dbRecord: any): MenuOption => {
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
