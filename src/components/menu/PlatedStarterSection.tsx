import React from 'react';
import { platedStarterOptions } from './MenuTypes';
import MenuDropdown from './common/MenuDropdown';

interface PlatedStarterSectionProps {
  selectedPlatedStarter: string;
  onPlatedStarterChange: (value: string) => void;
}

const PlatedStarterSection = ({
  selectedPlatedStarter,
  onPlatedStarterChange,
}: PlatedStarterSectionProps) => {
  return (
    <div className="print:break-inside-avoid">
      <MenuDropdown
        value={selectedPlatedStarter}
        onValueChange={onPlatedStarterChange}
        options={platedStarterOptions}
        placeholder="Select your plated starter"
      />
    </div>
  );
};

export default PlatedStarterSection;