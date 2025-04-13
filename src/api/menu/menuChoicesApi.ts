
import { supabase } from "@/integrations/supabase/client";
import { MenuChoice, MenuChoiceFormData } from "../types/menuChoices";

export const fetchMenuChoices = async () => {
  try {
    console.log('Fetching menu choices');
    const { data, error } = await supabase
      .from('menu_choices')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('Error fetching menu choices:', error);
      throw error;
    }
    
    return data as MenuChoice[];
  } catch (error) {
    console.error('Error in fetchMenuChoices:', error);
    throw error;
  }
};

export const fetchMenuChoicesBySection = async (sectionId: string) => {
  try {
    console.log(`Fetching menu choices for section: ${sectionId}`);
    const { data, error } = await supabase
      .from('menu_choices')
      .select('*')
      .eq('section_id', sectionId)
      .order('display_order');
    
    if (error) {
      console.error('Error fetching menu choices by section:', error);
      throw error;
    }
    
    return data as MenuChoice[];
  } catch (error) {
    console.error('Error in fetchMenuChoicesBySection:', error);
    throw error;
  }
};

export const createMenuChoice = async (choice: MenuChoiceFormData) => {
  try {
    const { data, error } = await supabase
      .from('menu_choices')
      .insert(choice)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating menu choice:', error);
      throw error;
    }
    
    return data as MenuChoice;
  } catch (error) {
    console.error('Error in createMenuChoice:', error);
    throw error;
  }
};

export const updateMenuChoice = async (id: string, choice: Partial<MenuChoiceFormData>) => {
  try {
    const { data, error } = await supabase
      .from('menu_choices')
      .update(choice)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating menu choice:', error);
      throw error;
    }
    
    return data as MenuChoice;
  } catch (error) {
    console.error('Error in updateMenuChoice:', error);
    throw error;
  }
};

export const deleteMenuChoice = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_choices')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting menu choice:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMenuChoice:', error);
    throw error;
  }
};
