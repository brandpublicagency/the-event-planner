
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
}

const WeddingMenuPlanner = ({ eventCode, eventName, isCustomMenu, onCustomMenuToggle }: WeddingMenuPlannerProps) => {
  const { toast } = useToast();
  const { 
    menuState, 
    error,
    isLoading,
    handleCustomMenuToggle,
    handleCanapeSelection,
    handleMenuStateChange,
    saveMenuSelections
  } = useMenuState(eventCode, toast);

  // Sync external isCustomMenu state with menu state
  React.useEffect(() => {
    if (isCustomMenu !== undefined && isCustomMenu !== menuState.isCustomMenu) {
      handleMenuStateChange('isCustomMenu', isCustomMenu);
    }
  }, [isCustomMenu]);

  // Sync menu state changes back to parent
  React.useEffect(() => {
    if (onCustomMenuToggle && menuState.isCustomMenu !== isCustomMenu) {
      onCustomMenuToggle(menuState.isCustomMenu);
    }
  }, [menuState.isCustomMenu]);

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
