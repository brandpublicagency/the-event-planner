import React from 'react';
import { Button } from "@/components/ui/button";
import StarterTypeSelect from './StarterTypeSelect';
import CanapeSection from './CanapeSection';
import PlatedStarterSection from './PlatedStarterSection';
import CustomMenuSection from './CustomMenuSection';
import MainCourseSection from './MainCourseSection';
import DessertSection from './DessertSection';
import OtherOptionsSection from './OtherOptionsSection';
import { starterTypes } from './MenuTypes';

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
          <Button onClick={saveMenuSelections}>Save Menu</Button>
        </div>
      </div>
    );
  }

  const selectedStarterType = starterTypes.find(type => type.value === menuState.selectedStarterType);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Arrival & Starter</h3>
          {!menuState.selectedStarterType ? (
            <StarterTypeSelect
              selectedStarterType={menuState.selectedStarterType}
              onStarterTypeChange={(value) => {
                onMenuStateChange('selectedStarterType', value);
                onMenuStateChange('selectedCanapePackage', '');
                onMenuStateChange('selectedCanapes', []);
                onMenuStateChange('selectedPlatedStarter', '');
              }}
            />
          ) : (
            <div className="text-zinc-600 mt-2">
              {selectedStarterType?.label}
            </div>
          )}
        </div>

        {menuState.selectedStarterType?.startsWith('canapes') && (
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
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Main Course</h3>
          <MainCourseSection
            selectedMainCourse={menuState.mainCourseType}
            buffetMeatSelections={menuState.buffetMeatSelections}
            buffetVegetableSelections={menuState.buffetVegetableSelections}
            buffetStarchSelections={menuState.buffetStarchSelections}
            buffetSaladSelection={menuState.buffetSaladSelection}
            karooMeatSelection={menuState.karooMeatSelection}
            karooStarchSelection={menuState.karooStarchSelection}
            karooVegetableSelections={menuState.karooVegetableSelections}
            karooSaladSelection={menuState.karooSaladSelection}
            platedMainSelection={menuState.platedMainSelection}
            platedSaladSelection={menuState.platedSaladSelection}
            onMainCourseChange={(value) => {
              onMenuStateChange('mainCourseType', value);
              onMenuStateChange('buffetMeatSelections', []);
              onMenuStateChange('buffetVegetableSelections', []);
              onMenuStateChange('buffetStarchSelections', []);
              onMenuStateChange('buffetSaladSelection', '');
              onMenuStateChange('karooMeatSelection', '');
              onMenuStateChange('karooStarchSelection', '');
              onMenuStateChange('karooVegetableSelections', []);
              onMenuStateChange('karooSaladSelection', '');
              onMenuStateChange('platedMainSelection', '');
              onMenuStateChange('platedSaladSelection', '');
            }}
            onBuffetMeatSelectionsChange={(value) => onMenuStateChange('buffetMeatSelections', value)}
            onBuffetVegetableSelectionsChange={(value) => onMenuStateChange('buffetVegetableSelections', value)}
            onBuffetStarchSelectionsChange={(value) => onMenuStateChange('buffetStarchSelections', value)}
            onBuffetSaladSelectionChange={(value) => onMenuStateChange('buffetSaladSelection', value)}
            onKarooMeatSelectionChange={(value) => onMenuStateChange('karooMeatSelection', value)}
            onKarooStarchSelectionChange={(value) => onMenuStateChange('karooStarchSelection', value)}
            onKarooVegetableSelectionsChange={(value) => onMenuStateChange('karooVegetableSelections', value)}
            onKarooSaladSelectionChange={(value) => onMenuStateChange('karooSaladSelection', value)}
            onPlatedMainSelectionChange={(value) => onMenuStateChange('platedMainSelection', value)}
            onPlatedSaladSelectionChange={(value) => onMenuStateChange('platedSaladSelection', value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Dessert</h3>
          <DessertSection
            selectedDessert={menuState.dessertType}
            onDessertChange={(value) => {
              onMenuStateChange('dessertType', value);
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Additional Options</h3>
          <OtherOptionsSection
            selectedOptions={menuState.otherSelections || []}
            onOptionsChange={(value) => {
              onMenuStateChange('otherSelections', value);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end print:hidden">
        <Button onClick={saveMenuSelections}>
          Save Menu
        </Button>
      </div>
    </div>
  );
};

export default MenuContent;