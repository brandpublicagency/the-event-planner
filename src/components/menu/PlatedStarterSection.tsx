import React from 'react';
import { platedStarterOptions } from './MenuTypes';
import MenuDropdown from './common/MenuDropdown';
import SelectionDisplay from './SelectionDisplay';

interface PlatedStarterSectionProps {
  selectedPlatedStarter: string;
  onPlatedStarterChange: (value: string) => void;
}

const PlatedStarterSection = ({
  selectedPlatedStarter,
  onPlatedStarterChange,
}: PlatedStarterSectionProps) => {
  const selectedOption = platedStarterOptions.find(opt => opt.value === selectedPlatedStarter);

  return (
    <div className="space-y-4">
      {!selectedPlatedStarter ? (
        <MenuDropdown
          value={selectedPlatedStarter}
          onValueChange={onPlatedStarterChange}
          options={platedStarterOptions}
          placeholder="Select your plated starter"
        />
      ) : (
        <SelectionDisplay
          label={selectedOption?.label || ''}
          onRemove={() => onPlatedStarterChange('')}
          actionLabel="Change"
        />
      )}
    </div>
  );
};

export default PlatedStarterSection;