
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { MenuState } from '@/hooks/menuStateTypes';

export const useEventMenu = (eventId: string | undefined) => {
  const [isCustomMenu, setIsCustomMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMenuFunction, setSaveMenuFunction] = useState<(() => Promise<void>) | null>(null);
  const [menuState, setMenuState] = useState<MenuState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update setMenuState to also set isInitialized flag
  const updateMenuState = useCallback((newState: MenuState) => {
    setMenuState(newState);
    setIsInitialized(true);
  }, []);

  const handleSaveMenu = async () => {
    if (!eventId || !menuState || !saveMenuFunction) {
      console.error("Cannot save: Missing id, menuState, or saveMenuFunction");
      toast.error("Cannot save menu: Required data is missing");
      return Promise.reject(new Error("Cannot save menu: Required data is missing"));
    }
    
    if (!isInitialized) {
      console.error("Cannot save: Menu state not fully initialized");
      toast.error("Cannot save menu: Menu state not fully initialized");
      return Promise.reject(new Error("Menu state not fully initialized"));
    }
    
    setIsSaving(true);
    try {
      // Call the actual save function from WeddingMenuPlanner with an increased timeout
      await Promise.race([
        saveMenuFunction(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Menu save operation timed out")), 30000)
        )
      ]);
      
      console.log("Menu saved successfully");
      toast.success("Menu saved successfully");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Failed to save menu:", error.message || 'Unknown error');
      toast.error(`Failed to save menu: ${error.message || 'Unknown error'}`);
      throw error; // Let the SaveButton handle the error
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isCustomMenu,
    setIsCustomMenu,
    isSaving,
    saveMenuFunction,
    setSaveMenuFunction,
    menuState,
    setMenuState: updateMenuState,
    isInitialized,
    handleSaveMenu
  };
};
