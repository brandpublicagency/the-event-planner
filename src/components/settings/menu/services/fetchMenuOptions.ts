
import { supabase } from "@/integrations/supabase/client";
import { MenuOption } from "@/hooks/useMenuOptions";
import { toast } from "@/hooks/use-toast";
import { transformDbOptionToMenuOption } from "./createMenuOption";

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
