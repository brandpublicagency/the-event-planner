
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
    if (!eventId) {
      console.error("Cannot save: Missing event ID");
      toast.error("Cannot save menu: Event ID is missing");
      return Promise.reject(new Error("Event ID is missing"));
    }
    
    if (!menuState) {
      console.error("Cannot save: Menu state is not available");
      toast.error("Cannot save menu: Menu state is not available");
      return Promise.reject(new Error("Menu state is not available"));
    }
    
    if (!saveMenuFunction || typeof saveMenuFunction !== 'function') {
      console.error("Cannot save: Save function is not properly registered", { saveMenuFunction });
      toast.error("Cannot save menu: Save function is not available");
      return Promise.reject(new Error("Save function is not properly registered"));
    }
    
    if (!isInitialized) {
      console.error("Cannot save: Menu state not fully initialized");
      toast.error("Cannot save menu: Menu state not fully initialized");
      return Promise.reject(new Error("Menu state not fully initialized"));
    }
    
    setIsSaving(true);
    try {
      // Call the actual save function that was passed from WeddingMenuPlanner
      await saveMenuFunction();
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
