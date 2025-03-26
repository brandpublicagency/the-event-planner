
import { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";

export const useEventMenuSave = (eventId: string | undefined, isInitialized: boolean) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMenuFunction, setSaveMenuFunction] = useState<(() => Promise<void>) | null>(null);
  const saveFunctionRegistered = useRef(false);
  const lastSaveTime = useRef<number | null>(null);
  const saveAttempts = useRef(0);
  const maxRetries = 3;
  const toastShown = useRef(false);
  const saveSuccessToastId = useRef<string | number | null>(null);
  const saveErrorToastId = useRef<string | number | null>(null);

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
      toast.error("Cannot save: Missing event ID", { id: 'missing-event-id' });
      return Promise.reject(new Error("Event ID is missing"));
    }
    
    if (!saveMenuFunction || typeof saveMenuFunction !== 'function') {
      console.error("Cannot save: Save function is not properly registered", { saveMenuFunction });
      toast.error("Cannot save: Save function is not properly registered", { id: 'missing-save-fn' });
      return Promise.reject(new Error("Save function is not properly registered"));
    }
    
    if (!isInitialized) {
      console.error("Cannot save: Menu state not fully initialized");
      toast.error("Cannot save: Menu state not fully initialized", { id: 'state-not-init' });
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
    
    // Dismiss any existing toasts to prevent duplicates
    if (saveSuccessToastId.current) {
      toast.dismiss(saveSuccessToastId.current);
      saveSuccessToastId.current = null;
    }
    if (saveErrorToastId.current) {
      toast.dismiss(saveErrorToastId.current);
      saveErrorToastId.current = null;
    }
    
    // Reset toast shown flag
    toastShown.current = false;
    
    let retryCount = 0;
    while (retryCount < maxRetries) {
      setIsSaving(true);
      try {
        await saveMenuFunction();
        console.log("Menu saved successfully");
        saveAttempts.current = 0; // Reset counter on success
        
        // Show success toast only once per save operation
        if (!toastShown.current) {
          saveSuccessToastId.current = toast.success("Menu saved successfully", {
            id: 'menu-save-success',
            duration: 3000
          });
          toastShown.current = true;
        }
        
        return Promise.resolve();
      } catch (error: any) {
        console.error(`Save attempt ${retryCount + 1} failed:`, error.message || 'Unknown error');
        retryCount++;
        
        if (retryCount === maxRetries) {
          console.error("All retry attempts failed");
          // Only show error toast if not already shown by lower-level hooks
          if (!toastShown.current) {
            saveErrorToastId.current = toast.error(`Failed to save menu after ${maxRetries} attempts`, {
              id: 'menu-save-error',
              duration: 5000
            });
            toastShown.current = true;
          }
          throw error;
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      } finally {
        setIsSaving(false);
      }
    }
  };

  return {
    isSaving,
    saveMenuFunction,
    setSaveMenuFunction,
    saveFunctionRegistered,
    handleSaveMenu
  };
};
