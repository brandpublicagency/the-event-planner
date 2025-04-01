
import React from 'react';
import { SaveButton } from "@/components/ui/save-button";

interface MenuPlannerActionsProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
  isManualSaving: boolean;
}

const MenuPlannerActions: React.FC<MenuPlannerActionsProps> = ({
  onSave,
  isSaving,
  isManualSaving
}) => {
  return (
    <div className="mt-6 flex justify-end">
      <SaveButton
        onClick={onSave}
        disabled={isSaving || isManualSaving}
        defaultText="Save Menu"
        loadingText="Saving..."
        successText="Menu Saved"
        timeout={3000}
        className="min-w-[120px]"
      />
    </div>
  );
};

export default MenuPlannerActions;
