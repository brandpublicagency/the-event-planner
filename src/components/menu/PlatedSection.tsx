import React from 'react';
import { platedMainOptions, saladOptions } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
import SelectionDisplay from './SelectionDisplay';
import MenuDropdown from './common/MenuDropdown';

interface PlatedSectionProps {
  platedMainSelection: string;
  platedSaladSelection: string;
  onPlatedMainSelectionChange: (value: string) => void;
  onPlatedSaladSelectionChange: (value: string) => void;
}

const PlatedSection = ({
  platedMainSelection,
  platedSaladSelection,
  onPlatedMainSelectionChange,
  onPlatedSaladSelectionChange,
}: PlatedSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SelectionHeader title="MAIN COURSE" />
        {!platedMainSelection ? (
          <MenuDropdown
            value={platedMainSelection}
            onValueChange={onPlatedMainSelectionChange}
            options={platedMainOptions}
            placeholder="Select main course"
          />
        ) : (
          <SelectionDisplay
            label={platedMainOptions.find(opt => opt.value === platedMainSelection)?.label || ''}
            onRemove={() => onPlatedMainSelectionChange('')}
          />
        )}
      </div>

      <div className="space-y-4">
        <SelectionHeader title="TABLE SALAD" />
        {!platedSaladSelection ? (
          <MenuDropdown
            value={platedSaladSelection}
            onValueChange={onPlatedSaladSelectionChange}
            options={saladOptions}
            placeholder="Select a salad"
          />
        ) : (
          <SelectionDisplay
            label={saladOptions.find(opt => opt.value === platedSaladSelection)?.label || ''}
            onRemove={() => onPlatedSaladSelectionChange('')}
          />
        )}
      </div>
    </div>
  );
};

export default PlatedSection;