
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MenuState } from '@/hooks/menuStateTypes';

export const useEventMenu = (eventId: string | undefined) => {
  const { toast } = useToast();
  const [isCustomMenu, setIsCustomMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMenuFunction, setSaveMenuFunction] = useState<(() => Promise<void>) | null>(null);
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const handleSaveMenu = async () => {
    if (!eventId || !menuState || !saveMenuFunction) {
      console.error("Cannot save: Missing id, menuState, or saveMenuFunction");
      toast({
        title: "Error",
        description: "Cannot save menu: Required data is missing",
        variant: "destructive"
      });
      return Promise.reject(new Error("Cannot save menu: Required data is missing"));
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
      toast({
        title: "Success",
        description: "Menu saved successfully",
        variant: "success"
      });
      return Promise.resolve();
    } catch (error: any) {
      console.error("Failed to save menu:", error.message || 'Unknown error');
      toast({
        title: "Error",
        description: `Failed to save menu: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
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
    setMenuState,
    handleSaveMenu
  };
};
