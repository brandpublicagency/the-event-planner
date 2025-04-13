
import { supabase } from "@/integrations/supabase/client";
import { MenuSection, MenuSectionFormData } from "../types/menuSections";

export const fetchMenuSections = async () => {
  try {
    console.log('Fetching menu sections');
    const { data, error } = await supabase
      .from('menu_sections')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('Error fetching menu sections:', error);
      throw error;
    }
    
    return data as MenuSection[];
  } catch (error) {
    console.error('Error in fetchMenuSections:', error);
    throw error;
  }
};

export const createMenuSection = async (section: MenuSectionFormData) => {
  try {
    const { data, error } = await supabase
      .from('menu_sections')
      .insert(section)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating menu section:', error);
      throw error;
    }
    
    return data as MenuSection;
  } catch (error) {
    console.error('Error in createMenuSection:', error);
    throw error;
  }
};

export const updateMenuSection = async (id: string, section: Partial<MenuSectionFormData>) => {
  try {
    const { data, error } = await supabase
      .from('menu_sections')
      .update(section)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating menu section:', error);
      throw error;
    }
    
    return data as MenuSection;
  } catch (error) {
    console.error('Error in updateMenuSection:', error);
    throw error;
  }
};

export const deleteMenuSection = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_sections')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting menu section:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMenuSection:', error);
    throw error;
  }
};
