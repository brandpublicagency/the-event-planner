
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
    setMenuState(prev => {
      const newCanapes = [...(prev.selectedCanapes || [])];
      newCanapes[position - 1] = value;
      return { ...prev, selectedCanapes: newCanapes };
    });
  }, [setMenuState]);

  return {
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection
  };
};
