
import React, { useEffect, useState } from 'react';
import { Separator } from "@/components/ui/separator";
import MenuContent from './menu/MenuContent';
import NotesSection from './menu/NotesSection';
import { useMenuState } from '../hooks/useMenuState';
import { MenuState } from '../hooks/menuStateTypes';
import { useToast } from "@/hooks/use-toast";

interface WeddingMenuPlannerProps {
  eventCode: string;
  eventName?: string;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
  onMenuStateChange?: (menuState: MenuState) => void;
  saveMenuSelections?: (saveFn: () => Promise<void>) => void;
}

const WeddingMenuPlanner = ({ 
  eventCode, 
  eventName, 
  isCustomMenu, 
  onCustomMenuToggle,
  onMenuStateChange,
  saveMenuSelections
}: WeddingMenuPlannerProps) => {
  const { toast } = useToast();
  
  const { 
    menuState, 
    error,
    isLoading,
    handleMenuStateChange,
    handleCanapeSelection,
    saveMenuSelections: saveMenu
  } = useMenuState(eventCode, toast);
  
  // Flag to prevent feedback loop
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);

  // Pass the save function to the parent component
  useEffect(() => {
    if (saveMenuSelections) {
      saveMenuSelections(saveMenu);
    }
  }, [saveMenu, saveMenuSelections]);

  // Sync external isCustomMenu state with menu state - only when prop changes
  useEffect(() => {
    if (isCustomMenu !== undefined && isCustomMenu !== menuState.isCustomMenu && !isInternalUpdate) {
      handleMenuStateChange('isCustomMenu', isCustomMenu);
    }
  }, [isCustomMenu, menuState.isCustomMenu, handleMenuStateChange, isInternalUpdate]);

  // Sync menu state changes back to parent component for other components to use
  useEffect(() => {
    if (onMenuStateChange) {
      onMenuStateChange(menuState);
    }
    
    // Notify parent of custom menu changes, but only if it was changed internally
    // and not as a result of a prop change from the parent
    if (onCustomMenuToggle && isInternalUpdate) {
      onCustomMenuToggle(menuState.isCustomMenu);
      setIsInternalUpdate(false);
    }
  }, [menuState, onCustomMenuToggle, onMenuStateChange, isInternalUpdate]);

  // Handle internal changes to the custom menu toggle
  const handleInternalCustomMenuToggle = (value: boolean) => {
    setIsInternalUpdate(true);
    handleMenuStateChange('isCustomMenu', value);
  };

  if (isLoading) {
    return (
      <div className="mt-4 print:mt-0">
        <div className="py-6">
          <div className="text-center animate-pulse">Loading menu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 print:mt-0">
        <div className="py-6">
          <div className="text-red-600 text-center animate-in fade-in slide-in-from-top-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 print:mt-0">
      <div className="space-y-4">
        <MenuContent 
          menuState={menuState}
          onMenuStateChange={(field: keyof MenuState, value: any) => {
            if (field === 'isCustomMenu') {
              handleInternalCustomMenuToggle(value as boolean);
            } else {
              handleMenuStateChange(field, value);
            }
          }}
          onCanapeSelection={handleCanapeSelection}
          saveMenuSelections={saveMenu}
        />
        <Separator className="my-4 separator print:hidden" />
        <div className="notes-section">
          <NotesSection 
            notes={menuState.notes}
            onChange={(value) => handleMenuStateChange('notes', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default WeddingMenuPlanner;
