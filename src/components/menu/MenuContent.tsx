import React from 'react';
import StarterTypeSelect from './StarterTypeSelect';
import CanapeSection from './CanapeSection';
import PlatedStarterSection from './PlatedStarterSection';
import CustomMenuSection from './CustomMenuSection';
import MainCourseSection from './MainCourseSection';
import DessertSection from './DessertSection';
import OtherOptionsSection from './OtherOptionsSection';

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
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 -mt-5">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-base mb-1.5 text-zinc-900">Arrival & Starter</h3>
          <StarterTypeSelect
            selectedStarterType={menuState.selectedStarterType}
            onStarterTypeChange={(value) => {
              onMenuStateChange('selectedStarterType', value);
              onMenuStateChange('selectedCanapePackage', '');
              onMenuStateChange('selectedCanapes', []);
              onMenuStateChange('selectedPlatedStarter', '');
            }}
          />
        </div>

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
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-base mb-1.5 text-zinc-900">Main Course</h3>
          <MainCourseSection
            selectedMainCourse={menuState.mainCourseType}
            buffetMeatSelections={menuState.buffetMeatSelections}
            buffetVegetableSelections={menuState.buffetVegetableSelections}
            buffetStarchSelections={menuState.buffetStarchSelections}
            buffetSaladSelection={menuState.buffetSaladSelection}
            karooMeatSelection={menuState.karooMeatSelection}
            karooStarchSelection={menuState.karooStarchSelection || []}
            karooVegetableSelections={menuState.karooVegetableSelections}
            karooSaladSelection={menuState.karooSaladSelection}
            platedMainSelection={menuState.platedMainSelection}
            platedSaladSelection={menuState.platedSaladSelection}
            onMainCourseChange={(value) => {
              onMenuStateChange('mainCourseType', value);
              // Reset all main course related selections
              onMenuStateChange('buffetMeatSelections', []);
              onMenuStateChange('buffetVegetableSelections', []);
              onMenuStateChange('buffetStarchSelections', []);
              onMenuStateChange('buffetSaladSelection', '');
              onMenuStateChange('karooMeatSelection', '');
              onMenuStateChange('karooStarchSelection', []);
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
          <h3 className="font-semibold text-base mb-1.5 text-zinc-900">Dessert</h3>
          <DessertSection
            selectedDessert={menuState.dessertType}
            selectedTraditionalDessert={menuState.traditionalDessert}
            selectedDessertCanapes={menuState.dessertCanapes}
            selectedIndividualCakes={menuState.individualCakes}
            onDessertChange={(value) => {
              onMenuStateChange('dessertType', value);
              onMenuStateChange('traditionalDessert', '');
              onMenuStateChange('dessertCanapes', []);
              onMenuStateChange('individualCakes', []);
            }}
            onTraditionalDessertChange={(value) => onMenuStateChange('traditionalDessert', value)}
            onDessertCanapesChange={(value) => onMenuStateChange('dessertCanapes', value)}
            onIndividualCakesChange={(value) => onMenuStateChange('individualCakes', value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-base mb-1.5 text-zinc-900">Additional Options</h3>
          <OtherOptionsSection
            quantities={menuState.otherSelectionsQuantities || {}}
            onQuantityChange={(optionId, quantity) => {
              const newQuantities = {
                ...menuState.otherSelectionsQuantities,
                [optionId]: quantity
              };
              onMenuStateChange('otherSelectionsQuantities', newQuantities);
              
              // Update otherSelections based on quantities
              const newOtherSelections = Object.entries(newQuantities)
                .filter(([_, qty]) => (qty as number) > 0)
                .map(([id]) => id);
              
              onMenuStateChange('otherSelections', newOtherSelections);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuContent;