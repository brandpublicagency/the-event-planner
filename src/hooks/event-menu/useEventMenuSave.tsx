
import { useState, useRef, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export const useEventMenuSave = (eventId: string | undefined, isInitialized: boolean) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMenuFunction, setSaveMenuFunction] = useState<(() => Promise<void>) | null>(null);
  const saveFunctionRegistered = useRef(false);
  const lastSaveTime = useRef<number | null>(null);
  const saveAttempts = useRef(0);
  const maxRetries = 3;

  // Effect to properly track when the save function is registered
  useEffect(() => {
    if (saveMenuFunction && !saveFunctionRegistered.current) {
      console.log("Save function has been successfully registered");
      saveFunctionRegistered.current = true;
    } else if (!saveMenuFunction && saveFunctionRegistered.current) {
      console.log("Save function has been unregistered");
      saveFunctionRegistered.current = false;
    }
  }, [saveMenuFunction]);

  const handleSaveMenu = async () => {
    if (!eventId) {
      console.error("Cannot save: Missing event ID");
      toast({
        title: "Cannot save menu",
        description: "Missing event ID",
        variant: "destructive",
        id: 'event-menu-save'
      });
      return Promise.reject(new Error("Event ID is missing"));
    }
    
    if (!saveMenuFunction || typeof saveMenuFunction !== 'function') {
      console.error("Cannot save: Save function is not properly registered", { saveMenuFunction });
      toast({
        title: "Cannot save menu",
        description: "Save function is not properly registered",
        variant: "destructive", 
        id: 'event-menu-save'
      });
      return Promise.reject(new Error("Save function is not properly registered"));
    }
    
    if (!isInitialized) {
      console.error("Cannot save: Menu state not fully initialized");
      toast({
        title: "Cannot save menu",
        description: "Menu state not fully initialized",
        variant: "destructive",
        id: 'event-menu-save'
      });
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
    
    // Show single loading toast with consistent ID
    toast.loading("Saving menu...", { id: 'event-menu-save' });
    
    let retryCount = 0;
    while (retryCount < maxRetries) {
      setIsSaving(true);
      try {
        await saveMenuFunction();
        console.log("Menu saved successfully");
        saveAttempts.current = 0; // Reset counter on success
        
        // Update the same toast with success message
        toast.success("Menu saved successfully", {
          id: 'event-menu-save',
          duration: 3000
        });
        
        setIsSaving(false);
        return Promise.resolve();
      } catch (error: any) {
        console.error(`Save attempt ${retryCount + 1} failed:`, error.message || 'Unknown error');
        retryCount++;
        
        if (retryCount === maxRetries) {
          console.error("All retry attempts failed");
          
          // Update the same toast with error message
          toast.error("Failed to save menu", {
            id: 'event-menu-save',
            description: `Failed after ${maxRetries} attempts`,
            duration: 5000
          });
          
          setIsSaving(false);
          throw error;
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
    
    // This should never be reached due to the return/throw inside the loop
    setIsSaving(false);
    return Promise.reject(new Error("Unexpected save failure"));
  };

  return {
    isSaving,
    saveMenuFunction,
    setSaveMenuFunction,
    saveFunctionRegistered,
    handleSaveMenu
  };
};
