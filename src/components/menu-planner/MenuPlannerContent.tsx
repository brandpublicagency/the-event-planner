
import React from 'react';
import { Separator } from "@/components/ui/separator";
import MenuContent from '@/components/menu/MenuContent';
import NotesSection from '@/components/menu/NotesSection';
import { MenuState } from '@/hooks/menuStateTypes';

interface MenuPlannerContentProps {
  menuState: MenuState;
  isSaving: boolean;
  onMenuStateChange: (field: keyof MenuState, value: any) => void;
  onCanapeSelection: (position: number, value: string) => void;
  handleInternalCustomMenuToggle: (value: boolean) => boolean;
}

const MenuPlannerContent: React.FC<MenuPlannerContentProps> = ({
  menuState,
  isSaving,
  onMenuStateChange,
  onCanapeSelection,
  handleInternalCustomMenuToggle
}) => {
  return (
    <div className="mt-4 print:mt-0">
      {isSaving && (
        <div className="fixed inset-0 bg-black/5 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              <p>Saving menu...</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <MenuContent 
          menuState={menuState}
          onMenuStateChange={(field: keyof MenuState, value: any) => {
            if (field === 'isCustomMenu') {
              const processedValue = handleInternalCustomMenuToggle(value as boolean);
              onMenuStateChange(field, processedValue);
            } else {
              onMenuStateChange(field, value);
            }
          }}
          onCanapeSelection={onCanapeSelection}
          saveMenuSelections={null} // We don't need this at this level anymore
        />
        <Separator className="my-4 separator print:hidden" />
        <div className="notes-section">
          <NotesSection 
            notes={menuState.notes}
            onChange={(value) => onMenuStateChange('notes', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuPlannerContent;
