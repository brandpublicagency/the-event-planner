
import { supabase } from "@/integrations/supabase/client";
import { MenuChoice, MenuChoiceFormData } from "../types/menuChoices";
import { handleError } from "./utils";

export const fetchMenuChoices = async () => {
  try {
    console.log('Fetching menu choices');
    const { data, error } = await supabase
      .from('menu_choices')
      .select('*')
      .order('display_order');
    
    if (error) {
      return handleError(error, 'fetchMenuChoices');
    }
    
    return data as MenuChoice[];
  } catch (error) {
    return handleError(error, 'fetchMenuChoices');
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
      return handleError(error, 'fetchMenuChoicesBySection');
    }
    
    return data as MenuChoice[];
  } catch (error) {
    return handleError(error, 'fetchMenuChoicesBySection');
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
      return handleError(error, 'createMenuChoice');
    }
    
    return data as MenuChoice;
  } catch (error) {
    return handleError(error, 'createMenuChoice');
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
      return handleError(error, 'updateMenuChoice');
    }
    
    return data as MenuChoice;
  } catch (error) {
    return handleError(error, 'updateMenuChoice');
  }
};

export const deleteMenuChoice = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_choices')
      .delete()
      .eq('id', id);
    
    if (error) {
      return handleError(error, 'deleteMenuChoice');
    }
    
    return true;
  } catch (error) {
    return handleError(error, 'deleteMenuChoice');
  }
};
