
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
