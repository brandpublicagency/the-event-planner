
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
      // Create a new array with the current selections
      const newCanapes = [...(prev.selectedCanapes || [])];
      
      // Arrays are zero-indexed, but our positions are 1-based
      const index = position - 1;
      
      // Ensure the array is long enough for this position
      while (newCanapes.length <= index) {
        newCanapes.push('');
      }
      
      // Set the value at the position
      newCanapes[index] = value;
      
      // Filter out empty strings when saving
      const filteredCanapes = newCanapes.filter(item => item !== '');
      
      console.log('Updated canapes array:', filteredCanapes);
      
      return { 
        ...prev, 
        selectedCanapes: filteredCanapes
      };
    });
  }, [setMenuState]);

  return {
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection
  };
};
