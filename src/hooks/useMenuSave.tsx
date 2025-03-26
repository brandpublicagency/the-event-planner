
import { useState, useCallback } from "react";
import { updateMenuSelection } from "@/services/menuService";
import { MenuState, SaveMenuData } from './menuStateTypes';
import { transformMenuStateToApi } from "@/utils/menu/menuStateTransformers";
import { toast } from "sonner";

export const useMenuSave = (eventCode: string, menuState: MenuState, isInitialized: boolean, setLastSavedState: (state: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveAttempt, setLastSaveAttempt] = useState<Date | null>(null);

  const saveMenuSelections = useCallback(async (): Promise<void> => {
    if (!eventCode) {
      const error = new Error('Event code is required');
      console.error('Cannot save: Event code is missing');
      toast.error('Cannot save: Missing event code');
      throw error;
    }

    if (!isInitialized) {
      const error = new Error('Menu state not fully initialized');
      console.error('Cannot save: Menu state not fully initialized');
      toast.error('Cannot save: Menu data not fully loaded');
      throw error;
    }

    // Prevent multiple rapid save attempts
    const now = new Date();
    if (lastSaveAttempt && now.getTime() - lastSaveAttempt.getTime() < 1000) {
      console.log('Throttling save request - too soon after previous save');
      return Promise.resolve();
    }

    setLastSaveAttempt(now);
    setIsSaving(true);
    
    try {
      console.log(`Starting menu save for event ${eventCode}...`);
      console.log('Current menu state before transform:', JSON.stringify(menuState, null, 2));
      
      // Transform menu state to API format
      const menuData: SaveMenuData = transformMenuStateToApi(eventCode, menuState);
      
      // Verify that critical fields were properly transformed
      console.log('Menu data after transform:', JSON.stringify({
        event_code: menuData.event_code,
        is_custom: menuData.is_custom,
        starter_type: menuData.starter_type,
        canape_package: menuData.canape_package,
        canape_selections: menuData.canape_selections,
        main_course_type: menuData.main_course_type,
        dessert_type: menuData.dessert_type
      }, null, 2));
      
      // Validate array fields
      if (Array.isArray(menuData.canape_selections)) {
        console.log('Canape selections to be saved:', menuData.canape_selections);
        if (menuData.canape_selections.length === 0 && menuState.selectedCanapes?.length > 0) {
          console.error('WARNING: Canape selections were lost during transformation!');
          menuData.canape_selections = [...menuState.selectedCanapes];
          console.log('Fixed canape selections:', menuData.canape_selections);
        }
      }
      
      // Save to database
      const result = await updateMenuSelection(eventCode, menuData);
      
      // Store the last saved state for change detection
      const savedStateString = JSON.stringify(menuData);
      setLastSavedState(savedStateString);
      
      console.log('Menu saved successfully:', result);
      toast.success('Menu saved successfully');
      
      return Promise.resolve();
    } catch (err: any) {
      console.error('Error saving menu selections:', err);
      toast.error(`Failed to save menu: ${err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [eventCode, menuState, isInitialized, setLastSavedState, lastSaveAttempt]);

  return {
    isSaving,
    saveMenuSelections
  };
};
