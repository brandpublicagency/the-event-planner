import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  value: string;
  label: string;
  category: string | null;
  choice_id: string;
  choice: string;
  image_url: string | null;
  display_order?: number;
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
  choice_type?: string;
};

export type MenuItemFormData = {
  value: string;
  label: string;
  category: string | null;
  choice_id: string;
  choice?: string;
  image_url: string | null;
  display_order?: number;
};

export type MenuSectionFormData = Omit<MenuSection, 'id' | 'created_at' | 'updated_at'>;
export type MenuChoiceFormData = Omit<MenuChoice, 'id' | 'created_at' | 'updated_at'>;

export const fetchMenuItems = async () => {
  try {
    console.log('Fetching all menu items');
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('display_order', { ascending: true })
      .order('label', { ascending: true });
    
    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
    
    const menuItems: MenuItem[] = data.map((item: any) => ({
      id: item.id,
      value: item.value,
      label: item.label,
      category: item.category || null,
      choice_id: item.choice_id,
      choice: item.choice || '',
      image_url: item.image_url || null,
      display_order: item.display_order || 0,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return menuItems;
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
      .order('display_order', { ascending: true })
      .order('category', { ascending: true, nullsFirst: false })
      .order('label', { ascending: true });
    
    if (error) {
      console.error('Error fetching menu items by choice:', error);
      throw error;
    }
    
    const menuItems: MenuItem[] = data.map((item: any) => ({
      id: item.id,
      value: item.value,
      label: item.label,
      category: item.category || null,
      choice_id: item.choice_id,
      choice: item.choice || '',
      image_url: item.image_url || null,
      display_order: item.display_order || 0,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return menuItems;
  } catch (error) {
    console.error('Error in fetchMenuItemsByChoice:', error);
    throw error;
  }
};

export const createMenuItem = async (menuItem: MenuItemFormData) => {
  try {
    const { data: choiceData, error: choiceError } = await supabase
      .from('menu_choices')
      .select('*')
      .eq('id', menuItem.choice_id)
      .single();
    
    if (choiceError) {
      console.error('Error fetching choice for menu item:', choiceError);
      throw choiceError;
    }
    
    const itemToCreate = {
      value: menuItem.value,
      label: menuItem.label,
      category: menuItem.category,
      choice_id: menuItem.choice_id,
      choice: choiceData.value,
      image_url: null,
      display_order: menuItem.display_order || 0
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
    
    const createdItem: MenuItem = {
      id: data.id,
      value: data.value,
      label: data.label,
      category: data.category || null,
      choice_id: data.choice_id,
      choice: data.choice,
      image_url: data.image_url || null,
      display_order: data.display_order || 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return createdItem;
  } catch (error) {
    console.error('Error in createMenuItem:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, menuItem: Partial<MenuItemFormData>) => {
  try {
    let itemToUpdate: any = { ...menuItem };
    
    if (menuItem.choice_id) {
      const { data: choiceData, error: choiceError } = await supabase
        .from('menu_choices')
        .select('*')
        .eq('id', menuItem.choice_id)
        .single();
      
      if (choiceError) {
        console.error('Error fetching choice for menu item update:', choiceError);
        throw choiceError;
      }
      
      itemToUpdate.choice = choiceData.value;
    }

    itemToUpdate.image_url = null;

    const { data, error } = await supabase
      .from('menu_items')
      .update(itemToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
    
    const updatedItem: MenuItem = {
      id: data.id,
      value: data.value,
      label: data.label,
      category: data.category || null,
      choice_id: data.choice_id,
      choice: data.choice,
      image_url: data.image_url || null,
      display_order: data.display_order || 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return updatedItem;
  } catch (error) {
    console.error('Error in updateMenuItem:', error);
    throw error;
  }
};

export const reorderMenuItems = async (items: MenuItem[]) => {
  try {
    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index,
      value: item.value,
      label: item.label,
      choice: item.choice,
      category: item.category
    }));

    const { error } = await supabase
      .from('menu_items')
      .upsert(updates, { onConflict: 'id' });
    
    if (error) {
      console.error('Error reordering menu items:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in reorderMenuItems:', error);
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
