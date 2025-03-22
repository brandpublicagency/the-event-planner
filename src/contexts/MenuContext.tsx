
import { createContext, useContext, ReactNode, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MenuSelection {
  is_custom?: boolean;
  custom_menu_details?: string;
  canape_package?: string;
  canape_selections?: string[];
  starter_type?: string;
  main_course_type?: string;
  dessert_type?: string;
  notes?: string;
  event_code?: string;
}

interface MenuContextType {
  menuState: MenuSelection;
  setMenuState: (state: MenuSelection) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuState, setMenuState] = useState<MenuSelection>({});

  return (
    <MenuContext.Provider value={{ menuState, setMenuState }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuState() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuState must be used within a MenuProvider');
  }
  return context;
}

export class MenuService {
  private toast = useToast().toast;

  async getMenuSelections(eventCode: string): Promise<MenuSelection | null> {
    try {
      const { data, error } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', eventCode)
        .single();

      if (error) {
        console.error('Error fetching menu selections:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Failed to load menu selections:', error);
      return null;
    }
  }

  async saveMenuSelections(eventCode: string, menu: MenuSelection): Promise<void> {
    try {
      const menuData = {
        ...menu,
        event_code: eventCode,
        updated_at: new Date().toISOString()
      };

      // Check if menu selection exists for this event
      const { data: existingMenu } = await supabase
        .from('menu_selections')
        .select('id')
        .eq('event_code', eventCode)
        .single();

      if (existingMenu) {
        // Update existing record
        const { error } = await supabase
          .from('menu_selections')
          .update(menuData)
          .eq('event_code', eventCode);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('menu_selections')
          .insert([menuData]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Failed to save menu selections:', error);
      throw error;
    }
  }
}
