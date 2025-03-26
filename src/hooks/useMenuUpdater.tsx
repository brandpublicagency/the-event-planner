
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
      // Create a deep copy of current state
      const newState = { ...prev };
      
      // Initialize or copy the canapes array
      const currentCanapes = Array.isArray(prev.selectedCanapes) 
        ? [...prev.selectedCanapes] 
        : [];
      
      let newCanapes: string[];
      
      if (value === '') {
        // Remove canape at this position
        newCanapes = currentCanapes.filter((_, idx) => idx !== position - 1);
        
        // If removing the last item in the array
        if (position === currentCanapes.length) {
          newCanapes = currentCanapes.slice(0, -1);
        } else {
          // Rebuild array without the item at position
          newCanapes = [];
          for (let i = 0; i < currentCanapes.length; i++) {
            if (i !== position - 1) {
              newCanapes.push(currentCanapes[i]);
            }
          }
        }
      } else {
        // For adding/updating, ensure array is large enough
        newCanapes = [...currentCanapes];
        
        // Arrays are zero-indexed, but positions are 1-based
        const index = position - 1;
        
        // Ensure the array is long enough
        while (newCanapes.length <= index) {
          newCanapes.push('');
        }
        
        // Set the value at the position
        newCanapes[index] = value;
      }
      
      // Remove empty strings at the end
      while (newCanapes.length > 0 && newCanapes[newCanapes.length - 1] === '') {
        newCanapes.pop();
      }
      
      console.log('Updated canapes array:', newCanapes);
      
      // Update the state with new canapes array
      return {
        ...newState,
        selectedCanapes: newCanapes
      };
    });
  }, [setMenuState]);

  return {
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection
  };
};
