import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  value: string;
  label: string;
  description: string | null;
  choice_id: string;
  available: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type MenuSection = {
  id: string;
  value: string;
  label: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuChoice = {
  id: string;
  section_id: string;
  value: string;
  label: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuItemFormData = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>;
export type MenuSectionFormData = Omit<MenuSection, 'id' | 'created_at' | 'updated_at'>;
export type MenuChoiceFormData = Omit<MenuChoice, 'id' | 'created_at' | 'updated_at'>;

export const fetchMenuItems = async () => {
  try {
    console.log('Fetching all menu items');
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('label');
    
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    return data as MenuItem[];
  } catch (error) {
    console.error('Error in fetchMenuItems:', error);
    throw error;
  }
};

export const fetchMenuItemsByChoice = async (choiceId: string) => {
  try {
    console.log(`Fetching menu items for choice: ${choiceId}`);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('choice_id', choiceId)
      .order('label');
    
    if (error) {
      console.error('Error fetching menu items by choice:', error);
      throw error;
    }
    
    return data as MenuItem[];
  } catch (error) {
    console.error('Error in fetchMenuItemsByChoice:', error);
    throw error;
  }
};

export const createMenuItem = async (menuItem: MenuItemFormData) => {
  try {
    // Make sure available is set to true by default if not provided
    const itemToCreate = {
      ...menuItem,
      available: menuItem.available !== false
    };

    const { data, error } = await supabase
      .from('menu_items')
      .insert(itemToCreate)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
    
    return data as MenuItem;
  } catch (error) {
    console.error('Error in createMenuItem:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, menuItem: Partial<MenuItemFormData>) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(menuItem)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
    
    return data as MenuItem;
  } catch (error) {
    console.error('Error in updateMenuItem:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMenuItem:', error);
    throw error;
  }
};

// Image upload functions
export const uploadMenuItemImage = async (file: File, menuItemId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${menuItemId}-${Date.now()}.${fileExt}`;
    const filePath = `menu-items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadMenuItemImage:', error);
    throw error;
  }
};

export const deleteMenuItemImage = async (url: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketName = pathParts[1]; // Usually 'menu-images'
    const filePath = pathParts.slice(2).join('/');

    if (bucketName && filePath) {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in deleteMenuItemImage:', error);
    throw error;
  }
};

// Menu section management functions
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

// Menu choice management functions
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
