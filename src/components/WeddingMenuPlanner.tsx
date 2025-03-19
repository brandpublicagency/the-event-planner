
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import MenuContent from './menu/MenuContent';
import NotesSection from './menu/NotesSection';
import { useMenuState } from '../hooks/useMenuState';

interface WeddingMenuPlannerProps {
  eventCode: string;
  eventName?: string;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
  onMenuStateChange?: (menuState: any) => void;
}

const WeddingMenuPlanner = ({ 
  eventCode, 
  eventName, 
  isCustomMenu, 
  onCustomMenuToggle,
  onMenuStateChange 
}: WeddingMenuPlannerProps) => {
  const { toast } = useToast();
  const { 
    menuState, 
    error,
    isLoading,
    handleMenuStateChange,
    handleCanapeSelection,
    saveMenuSelections
  } = useMenuState(eventCode, toast);

  // Sync external isCustomMenu state with menu state
  React.useEffect(() => {
    if (isCustomMenu !== undefined && isCustomMenu !== menuState.isCustomMenu) {
      console.log("Updating isCustomMenu in menu state:", isCustomMenu);
      handleMenuStateChange('isCustomMenu', isCustomMenu);
    }
  }, [isCustomMenu, menuState.isCustomMenu, handleMenuStateChange]);

  // Sync menu state changes back to parent
  React.useEffect(() => {
    if (onCustomMenuToggle && menuState.isCustomMenu !== isCustomMenu) {
      console.log("Notifying parent of custom menu toggle:", menuState.isCustomMenu);
      onCustomMenuToggle(menuState.isCustomMenu);
    }
    
    // Send menu state to parent component for print functionality
    if (onMenuStateChange) {
      onMenuStateChange(menuState);
    }
  }, [menuState, onCustomMenuToggle, onMenuStateChange, isCustomMenu]);

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
          onMenuStateChange={handleMenuStateChange}
          onCanapeSelection={handleCanapeSelection}
          saveMenuSelections={saveMenuSelections}
        />
        <Separator className="my-4 separator" />
        <div className="notes-section">
          <NotesSection 
            notes={menuState.notes}
            onChange={(value) => handleMenuStateChange('notes', value)}
          />
        </div>
        <div className="flex justify-end print:hidden">
          <Button onClick={saveMenuSelections}>
            Save Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeddingMenuPlanner;
