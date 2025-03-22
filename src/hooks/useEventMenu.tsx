
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { MenuState } from '@/hooks/menuStateTypes';

export const useEventMenu = (eventId: string | undefined) => {
  const [isCustomMenu, setIsCustomMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMenuFunction, setSaveMenuFunction] = useState<(() => Promise<void>) | null>(null);
  const [menuState, setMenuState] = useState<MenuState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const saveFunctionRegistered = useRef(false);
  const lastSaveTime = useRef<number | null>(null);
  const saveAttempts = useRef(0);

  // Log state changes for debugging
  useEffect(() => {
    console.log('useEventMenu state updated:', {
      eventId,
      isInitialized,
      hasMenuState: !!menuState,
      hasSaveFunction: !!saveMenuFunction,
      saveFunctionRegistered: saveFunctionRegistered.current,
      saveAttempts: saveAttempts.current
    });
  }, [eventId, menuState, saveMenuFunction, isInitialized]);

  // Update setMenuState to also set isInitialized flag
  const updateMenuState = useCallback((newState: MenuState) => {
    console.log('Menu state updated:', Object.keys(newState));
    setMenuState(newState);
    setIsInitialized(true);
  }, []);

  const handleSaveMenu = async () => {
    if (!eventId) {
      console.error("Cannot save: Missing event ID");
      toast.error("Cannot save: Missing event ID");
      return Promise.reject(new Error("Event ID is missing"));
    }
    
    if (!menuState) {
      console.error("Cannot save: Menu state is not available");
      toast.error("Cannot save: Menu state is not available");
      return Promise.reject(new Error("Menu state is not available"));
    }
    
    if (!saveMenuFunction || typeof saveMenuFunction !== 'function') {
      console.error("Cannot save: Save function is not properly registered", { saveMenuFunction });
      toast.error("Cannot save: Save function is not properly registered");
      return Promise.reject(new Error("Save function is not properly registered"));
    }
    
    if (!isInitialized) {
      console.error("Cannot save: Menu state not fully initialized");
      toast.error("Cannot save: Menu state not fully initialized");
      return Promise.reject(new Error("Menu state not fully initialized"));
    }
    
    // Prevent rapid repeated saves
    const now = Date.now();
    if (lastSaveTime.current && (now - lastSaveTime.current < 1000)) {
      console.log("Throttling save request - too soon after previous save");
      return Promise.resolve();
    }
    
    saveAttempts.current += 1;
    lastSaveTime.current = now;
    console.log(`Save attempt #${saveAttempts.current}`);
    
    setIsSaving(true);
    try {
      // Call the actual save function that was passed from WeddingMenuPlanner
      console.log("Executing save menu function");
      await saveMenuFunction();
      console.log("Menu saved successfully");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Failed to save menu:", error.message || 'Unknown error');
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
