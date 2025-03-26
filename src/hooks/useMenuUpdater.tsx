
import { useCallback } from "react";
import { MenuState } from './menuStateTypes';

export const useMenuUpdater = (setMenuState: React.Dispatch<React.SetStateAction<MenuState>>) => {
  const handleMenuStateChange = useCallback((field: keyof MenuState, value: any) => {
    console.log(`Updating menu state: ${String(field)}`, value);
    setMenuState(prev => ({ ...prev, [field]: value }));
  }, [setMenuState]);

  const handleCustomMenuToggle = useCallback((checked: boolean) => {
    handleMenuStateChange('isCustomMenu', checked);
  }, [handleMenuStateChange]);

  const handleCanapeSelection = useCallback((position: number, value: string) => {
    console.log(`Setting canape position ${position} to "${value}"`);
    
    setMenuState(prev => {
      // Create a new array with enough space for this position
      const newCanapes = [...(prev.selectedCanapes || [])];
      
      // Ensure the array is long enough (fill with empty strings if needed)
      while (newCanapes.length < position) {
        newCanapes.push('');
      }
      
      // Set the value at the position (adjusting for 0-indexed array)
      newCanapes[position - 1] = value;
      
      console.log('Updated canapes array:', newCanapes);
      
      // Filter out empty strings when returning the new state
      // This ensures we only store actual selections
      return { 
        ...prev, 
        selectedCanapes: newCanapes.map(item => item || '')
      };
    });
  }, [setMenuState]);

  return {
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection
  };
};
