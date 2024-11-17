import React from 'react';
import { platedMainOptions, saladOptions } from './MenuTypes';
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
    <div className="space-y-4">
      <div className="space-y-1">
        <h4 className="text-xs font-medium text-zinc-500">MAIN COURSE</h4>
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
            actionLabel="Change"
          />
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-medium text-zinc-500">TABLE SALAD</h4>
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
            actionLabel="Change"
          />
        )}
      </div>
    </div>
  );
};

export default PlatedSection;