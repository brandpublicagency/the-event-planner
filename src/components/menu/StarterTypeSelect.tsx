import React from 'react';
import { starterTypes } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
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
      <SelectionHeader title="STARTER TYPE" />
      {!selectedStarterType ? (
        <MenuDropdown
          value={selectedStarterType}
          onValueChange={onStarterTypeChange}
          options={starterTypes.map(type => ({
            value: type.value,
            label: type.label,
            price: type.price,
            priceType: 'per_person'
          }))}
          placeholder="Choose starter option"
        />
      ) : (
        <SelectionDisplay
          label={`${selectedType?.label} - R ${selectedType?.price.toFixed(2)} per person`}
          onRemove={() => onStarterTypeChange('')}
          actionLabel="Change"
        />
      )}
    </div>
  );
};

export default StarterTypeSelect;