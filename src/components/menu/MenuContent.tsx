import React from 'react';
import { Button } from "@/components/ui/button";
import StarterTypeSelect from './StarterTypeSelect';
import CanapeSection from './CanapeSection';
import PlatedStarterSection from './PlatedStarterSection';
import CustomMenuSection from './CustomMenuSection';

interface MenuContentProps {
  menuState: any;
  onMenuStateChange: (field: string, value: any) => void;
  onCanapeSelection: (position: number, value: string) => void;
  saveMenuSelections: () => Promise<void>;
}

const MenuContent = ({ 
  menuState, 
  onMenuStateChange, 
  onCanapeSelection,
  saveMenuSelections 
}: MenuContentProps) => {
  if (menuState.isCustomMenu) {
    return (
      <div className="space-y-4">
        <CustomMenuSection
          customMenuDetails={menuState.customMenuDetails}
          onCustomMenuDetailsChange={(value) => {
            onMenuStateChange('customMenuDetails', value);
          }}
        />
        <div className="flex justify-end print:hidden">
          <Button onClick={saveMenuSelections}>
            Save Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
      <StarterTypeSelect
        selectedStarterType={menuState.selectedStarterType}
        onStarterTypeChange={(value) => {
          onMenuStateChange('selectedStarterType', value);
          onMenuStateChange('selectedCanapePackage', '');
          onMenuStateChange('selectedCanapes', []);
          onMenuStateChange('selectedPlatedStarter', '');
        }}
      />

      {menuState.selectedStarterType === 'canapes' && (
        <div className="animate-in fade-in slide-in-from-top-4">
          <CanapeSection
            selectedCanapePackage={menuState.selectedCanapePackage}
            selectedCanapes={menuState.selectedCanapes}
            onCanapePackageChange={(value) => {
              onMenuStateChange('selectedCanapePackage', value);
              onMenuStateChange('selectedCanapes', []);
            }}
            onCanapeSelection={onCanapeSelection}
          />
        </div>
      )}

      {menuState.selectedStarterType === 'plated' && (
        <div className="animate-in fade-in slide-in-from-top-4">
          <PlatedStarterSection
            selectedPlatedStarter={menuState.selectedPlatedStarter}
            onPlatedStarterChange={(value) => {
              onMenuStateChange('selectedPlatedStarter', value);
            }}
          />
        </div>
      )}

      <div className="flex justify-end print:hidden">
        <Button onClick={saveMenuSelections}>
          Save Menu
        </Button>
      </div>
    </div>
  );
};

export default MenuContent;