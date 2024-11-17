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

  const formatPrice = (type: typeof starterTypes[0]) => {
    if (type.priceRange) {
      return `R ${type.priceRange.min.toFixed(2)} - R ${type.priceRange.max.toFixed(2)} per person`;
    }
    return `R ${type.price.toFixed(2)} per person`;
  };

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
          label={`${selectedType?.label}`}
          onRemove={() => onStarterTypeChange('')}
          actionLabel="Change"
        />
      )}
    </div>
  );
};

export default StarterTypeSelect;