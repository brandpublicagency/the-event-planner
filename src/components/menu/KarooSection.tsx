import React from 'react';
import { karooMeatOptions, karooStarchOptions, karooVegetableOptions, saladOptions } from './MenuTypes';
import SelectionDisplay from './SelectionDisplay';
import MenuDropdown from './common/MenuDropdown';

interface KarooSectionProps {
  karooMeatSelection: string;
  karooStarchSelection: string[];
  karooVegetableSelections: string[];
  karooSaladSelection: string;
  onKarooMeatSelectionChange: (value: string) => void;
  onKarooStarchSelectionChange: (value: string[]) => void;
  onKarooVegetableSelectionsChange: (value: string[]) => void;
  onKarooSaladSelectionChange: (value: string) => void;
}

const KarooSection = ({
  karooMeatSelection,
  karooStarchSelection,
  karooVegetableSelections,
  karooSaladSelection,
  onKarooMeatSelectionChange,
  onKarooStarchSelectionChange,
  onKarooVegetableSelectionsChange,
  onKarooSaladSelectionChange,
}: KarooSectionProps) => {
  const handleStarchSelection = (value: string) => {
    if (karooStarchSelection.includes(value)) {
      onKarooStarchSelectionChange(karooStarchSelection.filter(item => item !== value));
    } else if (karooStarchSelection.length < 2) {
      onKarooStarchSelectionChange([...karooStarchSelection, value]);
    }
  };

  const handleVegetableSelection = (value: string) => {
    if (karooVegetableSelections.includes(value)) {
      onKarooVegetableSelectionsChange(karooVegetableSelections.filter(item => item !== value));
    } else if (karooVegetableSelections.length < 2) {
      onKarooVegetableSelectionsChange([...karooVegetableSelections, value]);
    }
  };

  const renderSelectionSection = (
    title: string,
    selections: string[],
    options: typeof karooStarchOptions,
    onSelect: (value: string) => void,
    maxSelections: number = 2
  ) => (
    <div className="space-y-4">
      <div className="text-zinc-600 mb-2">{title}</div>
      {selections.map((selection) => {
        const option = options.find(opt => opt.value === selection);
        return (
          <SelectionDisplay
            key={selection}
            label={option?.label || ''}
            onRemove={() => onSelect(selection)}
          />
        );
      })}
      {selections.length < maxSelections && (
        <MenuDropdown
          value=""
          onValueChange={onSelect}
          options={options.filter(option => !selections.includes(option.value))}
          placeholder={`Add ${title.toLowerCase()} option`}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-zinc-600 mb-2">MEAT SELECTION</div>
        {!karooMeatSelection ? (
          <MenuDropdown
            value={karooMeatSelection}
            onValueChange={onKarooMeatSelectionChange}
            options={karooMeatOptions}
            placeholder="Select meat option"
          />
        ) : (
          <SelectionDisplay
            label={karooMeatOptions.find(opt => opt.value === karooMeatSelection)?.label || ''}
            onRemove={() => onKarooMeatSelectionChange('')}
            actionLabel="Change"
          />
        )}
      </div>

      {renderSelectionSection(
        "STARCH SELECTIONS",
        karooStarchSelection,
        karooStarchOptions,
        handleStarchSelection
      )}
      
      {renderSelectionSection(
        "VEGETABLE SELECTIONS",
        karooVegetableSelections,
        karooVegetableOptions,
        handleVegetableSelection
      )}

      <div className="space-y-4">
        <div className="text-zinc-600 mb-2">TABLE SALAD</div>
        {!karooSaladSelection ? (
          <MenuDropdown
            value={karooSaladSelection}
            onValueChange={onKarooSaladSelectionChange}
            options={saladOptions}
            placeholder="Select a salad"
          />
        ) : (
          <SelectionDisplay
            label={saladOptions.find(opt => opt.value === karooSaladSelection)?.label || ''}
            onRemove={() => onKarooSaladSelectionChange('')}
            actionLabel="Change"
          />
        )}
      </div>
    </div>
  );
};

export default KarooSection;