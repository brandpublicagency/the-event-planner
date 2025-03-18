
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
          options={starterTypes}
          placeholder="Choose starter option"
        />
      ) : (
        <SelectionDisplay
          label={selectedType?.label || ''}
          onRemove={() => onStarterTypeChange('')}
          actionLabel="Change"
          isBold={false}
        />
      )}
    </div>
  );
};

export default StarterTypeSelect;
