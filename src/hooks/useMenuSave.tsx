
import { useState, useCallback } from "react";
import { updateMenuSelection } from "@/services/menuService";
import { MenuState, SaveMenuData } from './menuStateTypes';
import { transformMenuStateToApi } from "@/utils/menu/menuStateTransformers";

export const useMenuSave = (eventCode: string, menuState: MenuState, isInitialized: boolean, setLastSavedState: (state: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveMenuSelections = useCallback(async (): Promise<void> => {
    if (!eventCode) {
      console.error('Cannot save: Event code is missing');
      throw new Error('Event code is required');
    }

    if (!isInitialized) {
      console.error('Cannot save: Menu state not fully initialized');
      throw new Error('Menu state not fully initialized');
    }

    try {
      console.log('Preparing menu data for saving...');
      setIsSaving(true);
      
      const menuData: SaveMenuData = transformMenuStateToApi(eventCode, menuState);

      console.log('Saving menu data with dessert info:', {
        dessertType: menuState.dessertType,
        traditionalDessert: menuState.traditionalDessert,
        menuData: menuData
      });
      
      const result = await updateMenuSelection(eventCode, menuData);
      
      setLastSavedState(JSON.stringify(menuData));
      
      console.log('Menu saved successfully', result);
      return Promise.resolve();
    } catch (err) {
      console.error('Error saving menu selections:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [eventCode, menuState, isInitialized, setLastSavedState]);

  return {
    isSaving,
    saveMenuSelections
  };
};
