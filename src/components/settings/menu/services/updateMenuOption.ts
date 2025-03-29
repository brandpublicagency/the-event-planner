
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
