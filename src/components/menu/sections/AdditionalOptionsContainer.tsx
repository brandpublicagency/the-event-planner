
import React from 'react';
import OtherOptionsSection from '../OtherOptionsSection';

interface AdditionalOptionsSectionContainerProps {
  menuState: any;
  onMenuStateChange: (field: string, value: any) => void;
}

const AdditionalOptionsSectionContainer: React.FC<AdditionalOptionsSectionContainerProps> = ({
  menuState,
  onMenuStateChange
}) => {
  return (
    <div className="space-y-4 menu-section">
      <div>
        <h3 className="font-semibold text-base mb-3 text-zinc-900 section-header">Additional Options</h3>
        <OtherOptionsSection 
          quantities={menuState.otherSelectionsQuantities || {}} 
          onQuantityChange={(optionId, quantity) => {
            const newQuantities = {
              ...menuState.otherSelectionsQuantities,
              [optionId]: quantity
            };
            onMenuStateChange('otherSelectionsQuantities', newQuantities);
            const newOtherSelections = Object.entries(newQuantities)
              .filter(([_, qty]) => qty as number > 0)
              .map(([id]) => id);
            onMenuStateChange('otherSelections', newOtherSelections);
          }} 
        />
      </div>
    </div>
  );
};

export default AdditionalOptionsSectionContainer;
