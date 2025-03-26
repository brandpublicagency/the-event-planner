
import { useState, useCallback } from "react";
import { updateMenuSelection } from "@/services/menuService";
import { MenuState, SaveMenuData } from './menuStateTypes';
import { transformMenuStateToApi } from "@/utils/menu/menuStateTransformers";
import { toast } from "@/components/ui/toast";

export const useMenuSave = (eventCode: string, menuState: MenuState, isInitialized: boolean, setLastSavedState: (state: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveAttempt, setLastSaveAttempt] = useState<Date | null>(null);

  const saveMenuSelections = useCallback(async (): Promise<void> => {
    if (!eventCode) {
      const error = new Error('Event code is required');
      console.error('Cannot save: Event code is missing');
      toast({
        variant: "destructive",
        title: "Cannot save menu",
        description: "Missing event code",
        id: 'menu-save'
      });
      throw error;
    }

    if (!isInitialized) {
      const error = new Error('Menu state not fully initialized');
      console.error('Cannot save: Menu state not fully initialized');
      toast({
        variant: "destructive",
        title: "Cannot save menu",
        description: "Menu data not fully loaded",
        id: 'menu-save'
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
    
    // Use a single toast with consistent ID
    toast.loading("Saving menu...", { id: 'menu-save' });
    
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
      
      // Update the same toast with success message
      toast.success("Menu saved successfully", { id: 'menu-save' });
      
      return Promise.resolve();
    } catch (err: any) {
      console.error('Error saving menu selections:', err);
      
      // Update the same toast with error message
      toast.error("Failed to save menu", { 
        description: err.message || 'Unknown error',
        id: 'menu-save'
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
