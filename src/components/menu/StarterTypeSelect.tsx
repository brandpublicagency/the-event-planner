import React from 'react';
import { starterTypes } from './MenuTypes';
import SelectionDisplay from './SelectionDisplay';
import MenuDropdown from './common/MenuDropdown';

interface StarterTypeSelectProps {
  selectedStarterType: string;
  onStarterTypeChange: (value: string) => void;
}

const StarterTypeSelect = ({
  selectedStarterType,
  onStarterTypeChange,
}: StarterTypeSelectProps) => {
  const selectedType = starterTypes.find(s => s.value === selectedStarterType);

  return (
    <div className="space-y-4">
      {!selectedStarterType ? (
        <MenuDropdown
          value={selectedStarterType}
          onValueChange={onStarterTypeChange}
          options={starterTypes.map(type => ({
            value: type.value,
            label: type.label,
            price: type.price,
            priceRange: type.priceRange,
            priceType: 'per_person'
          }))}
          placeholder="Choose starter option"
        />
      ) : (
        <SelectionDisplay
          label={selectedType?.label || ''}
          price={selectedType ? {
            value: selectedType.priceRange?.min || selectedType.price,
            type: 'per_person'
          } : undefined}
          onRemove={() => onStarterTypeChange('')}
          actionLabel="Change"
          showPrice={true}
        />
      )}
    </div>
  );
};

export default StarterTypeSelect;