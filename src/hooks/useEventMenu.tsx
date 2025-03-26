
import { useRef, useEffect, useState } from 'react';
import { useEventMenuState } from './event-menu/useEventMenuState';
import { useEventMenuSave } from './event-menu/useEventMenuSave';
import { useMenuDebugLogger } from './event-menu/useMenuDebugLogger';
import { MenuState } from './menuStateTypes';
import { toast } from "@/components/ui/toast";

export const useEventMenu = (eventId: string | undefined) => {
  // Use the smaller, focused hooks
  const {
    isCustomMenu,
    setIsCustomMenu,
    menuState,
    setMenuState,
    isInitialized
  } = useEventMenuState(eventId);

  // Track save attempts for debugging
  const saveAttempts = useRef(0);
  const saveFunctionRegistered = useRef(false);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  
  const {
    isSaving,
    saveMenuFunction,
    setSaveMenuFunction,
    handleSaveMenu: originalHandleSaveMenu
  } = useEventMenuSave(eventId, isInitialized);

  // Enhanced save handler with rate limiting and better error handling
  const handleSaveMenu = async () => {
    if (!eventId) {
      console.error("Cannot save: Missing event ID");
      toast({
        variant: "destructive",
        title: "Cannot save menu",
        description: "Missing event ID",
        id: 'event-menu-save'
      });
      return Promise.reject(new Error("Event ID is missing"));
    }
    
    if (!saveMenuFunction || typeof saveMenuFunction !== 'function') {
      console.error("Cannot save: Save function is not properly registered", { 
        hasFunction: !!saveMenuFunction,
        isFunction: typeof saveMenuFunction === 'function' 
      });
      toast({
        variant: "destructive",
        title: "Cannot save menu",
        description: "Save function is not properly registered",
        id: 'event-menu-save'
      });
      return Promise.reject(new Error("Save function is not properly registered"));
    }
    
    if (!isInitialized) {
      console.error("Cannot save: Menu state not fully initialized");
      toast({
        variant: "destructive",
        title: "Cannot save menu",
        description: "Menu state not fully initialized",
        id: 'event-menu-save'
      });
      return Promise.reject(new Error("Menu state not fully initialized"));
    }

    // Prevent rapid repeated saves
    const now = Date.now();
    if (lastSaveTime && (now - lastSaveTime < 1000)) {
      console.log("Throttling save request - too soon after previous save");
      return Promise.resolve();
    }

    saveAttempts.current += 1;
    setLastSaveTime(now);
    console.log(`Save attempt #${saveAttempts.current} at ${new Date().toISOString()}`);
    
    try {
      await originalHandleSaveMenu();
      console.log("Menu saved successfully");
      saveAttempts.current = 0; // Reset counter on success
      return Promise.resolve();
    } catch (error: any) {
      console.error(`Save attempt failed:`, error.message || 'Unknown error');
      throw error;
    }
  };

  // Effect to update registration status
  useEffect(() => {
    saveFunctionRegistered.current = !!saveMenuFunction;
    console.log("Save function registration status updated:", !!saveMenuFunction);
  }, [saveMenuFunction]);

  // Setup debug logging
  useMenuDebugLogger(
    eventId, 
    isInitialized, 
    menuState, 
    saveMenuFunction, 
    saveFunctionRegistered,
    saveAttempts
  );

  return {
    isCustomMenu,
    setIsCustomMenu,
    isSaving,
    saveMenuFunction,
    setSaveMenuFunction,
    menuState,
    setMenuState,
    isInitialized,
    handleSaveMenu
  };
};
