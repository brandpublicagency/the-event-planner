
import { supabase } from "@/integrations/supabase/client";
import { MenuSection, MenuSectionFormData } from "../types/menuSections";
import { handleError } from "./utils";

export const fetchMenuSections = async () => {
  try {
    console.log('Fetching menu sections');
    const { data, error } = await supabase
      .from('menu_sections')
      .select('*')
      .order('display_order');
    
    if (error) {
      return handleError(error, 'fetchMenuSections');
    }
    
    return data as MenuSection[];
  } catch (error) {
    return handleError(error, 'fetchMenuSections');
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
      return handleError(error, 'createMenuSection');
    }
    
    return data as MenuSection;
  } catch (error) {
    return handleError(error, 'createMenuSection');
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
      return handleError(error, 'updateMenuSection');
    }
    
    return data as MenuSection;
  } catch (error) {
    return handleError(error, 'updateMenuSection');
  }
};

export const deleteMenuSection = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_sections')
      .delete()
      .eq('id', id);
    
    if (error) {
      return handleError(error, 'deleteMenuSection');
    }
    
    return true;
  } catch (error) {
    return handleError(error, 'deleteMenuSection');
  }
};
