
import { useCallback } from "react";
import { MenuState } from './menuStateTypes';
import { transformMenuStateToApi } from "@/utils/menu/menuStateTransformers";

export const useMenuChangeDetection = (
  eventCode: string,
  menuState: MenuState,
  lastSavedState: string | null
) => {
  const hasUnsavedChanges = useCallback(() => {
    if (!lastSavedState) return true;
    
    const currentStateString = JSON.stringify(transformMenuStateToApi(eventCode, menuState));
    
    return currentStateString !== lastSavedState;
  }, [eventCode, lastSavedState, menuState]);

  return {
    hasUnsavedChanges
  };
};
