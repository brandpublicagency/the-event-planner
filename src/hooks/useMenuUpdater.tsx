
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
      // Create a copy of the current selections (or initialize as empty array)
      const currentCanapes = Array.isArray(prev.selectedCanapes) ? [...prev.selectedCanapes] : [];
      
      if (value === '') {
        // Remove the canape at the specified position
        // First create an array with all position mappings
        const mappedCanapes = currentCanapes.map((item, index) => ({ 
          value: item, 
          originalIndex: index + 1 
        }));
        
        // Filter out the position being removed
        const filteredCanapes = mappedCanapes
          .filter(item => item.originalIndex !== position)
          .map(item => item.value);
        
        console.log('Removed canape, new array:', filteredCanapes);
        
        return {
          ...prev,
          selectedCanapes: filteredCanapes
        };
      } else {
        // For adding/updating, we need to ensure the array is large enough
        const newCanapes = [...currentCanapes];
        
        // Arrays are zero-indexed, but positions are 1-based
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
      }
    });
  }, [setMenuState]);

  return {
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection
  };
};
