
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
      toast.error('Cannot save menu', {
        description: 'Missing event code',
        id: 'menu-save-error'
      });
      throw error;
    }

    if (!isInitialized) {
      const error = new Error('Menu state not fully initialized');
      console.error('Cannot save: Menu state not fully initialized');
      toast.error('Cannot save menu', {
        description: 'Menu data not fully loaded',
        id: 'menu-save-error'
      });
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
    
    // Dismiss any existing save toasts
    toast.dismiss('menu-save-success');
    toast.dismiss('menu-save-error');
    toast.dismiss('menu-saving');
    
    // Show saving toast
    toast.loading('Saving menu...', { id: 'menu-saving' });
    
    try {
      console.log(`Starting menu save for event ${eventCode}...`);
      
      // Transform menu state to API format
      const menuData: SaveMenuData = transformMenuStateToApi(eventCode, menuState);
      
      // Save to database
      const result = await updateMenuSelection(eventCode, menuData);
      
      // Store the last saved state for change detection
      const savedStateString = JSON.stringify(menuData);
      setLastSavedState(savedStateString);
      
      console.log('Menu saved successfully:', result);
      
      // Dismiss saving toast and show success
      toast.dismiss('menu-saving');
      toast.success('Menu saved successfully', { id: 'menu-save-success' });
      
      return Promise.resolve();
    } catch (err: any) {
      console.error('Error saving menu selections:', err);
      
      // Dismiss saving toast and show error
      toast.dismiss('menu-saving');
      toast.error('Failed to save menu', { 
        description: err.message || 'Unknown error',
        id: 'menu-save-error'
      });
      
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
