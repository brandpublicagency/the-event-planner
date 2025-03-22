
import React from 'react';
import DessertSection from '../DessertSection';

interface DessertSectionContainerProps {
  menuState: any;
  onMenuStateChange: (field: string, value: any) => void;
}

const DessertSectionContainer: React.FC<DessertSectionContainerProps> = ({
  menuState,
  onMenuStateChange
}) => {
  return (
    <div className="space-y-4 menu-section">
      <div>
        <h3 className="font-semibold text-base mb-3 text-zinc-900 section-header">Dessert</h3>
        <DessertSection 
          selectedDessert={menuState.dessertType} 
          selectedTraditionalDessert={menuState.traditionalDessert} 
          selectedDessertCanapes={menuState.dessertCanapes} 
          selectedIndividualCakes={menuState.individualCakes} 
          individualCakeQuantities={menuState.individual_cake_quantities} 
          onDessertChange={value => {
            onMenuStateChange('dessertType', value);
            onMenuStateChange('traditionalDessert', '');
            onMenuStateChange('dessertCanapes', []);
            onMenuStateChange('individualCakes', []);
            onMenuStateChange('individual_cake_quantities', {});
          }} 
          onTraditionalDessertChange={value => onMenuStateChange('traditionalDessert', value)} 
          onDessertCanapesChange={value => onMenuStateChange('dessertCanapes', value)} 
          onIndividualCakesChange={(cakes, quantities) => {
            onMenuStateChange('individualCakes', cakes);
            if (quantities) {
              onMenuStateChange('individual_cake_quantities', quantities);
            }
          }} 
        />
      </div>
    </div>
  );
};

export default DessertSectionContainer;
