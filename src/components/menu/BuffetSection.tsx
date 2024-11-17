import React from 'react';
import { buffetMeatOptions, buffetVegetableOptions, buffetStarchOptions, saladOptions } from './MenuTypes';
import SelectionDisplay from './SelectionDisplay';
import MenuDropdown from './common/MenuDropdown';

interface BuffetSectionProps {
  buffetMeatSelections: string[];
  buffetVegetableSelections: string[];
  buffetStarchSelections: string[];
  buffetSaladSelection: string;
  onBuffetMeatSelectionsChange: (value: string[]) => void;
  onBuffetVegetableSelectionsChange: (value: string[]) => void;
  onBuffetStarchSelectionsChange: (value: string[]) => void;
  onBuffetSaladSelectionChange: (value: string) => void;
}

const BuffetSection = ({
  buffetMeatSelections,
  buffetVegetableSelections,
  buffetStarchSelections,
  buffetSaladSelection,
  onBuffetMeatSelectionsChange,
  onBuffetVegetableSelectionsChange,
  onBuffetStarchSelectionsChange,
  onBuffetSaladSelectionChange,
}: BuffetSectionProps) => {
  const handleMeatSelection = (value: string) => {
    if (buffetMeatSelections.includes(value)) {
      onBuffetMeatSelectionsChange(buffetMeatSelections.filter(item => item !== value));
    } else if (buffetMeatSelections.length < 2) {
      onBuffetMeatSelectionsChange([...buffetMeatSelections, value]);
    }
  };

  const handleVegetableSelection = (value: string) => {
    if (buffetVegetableSelections.includes(value)) {
      onBuffetVegetableSelectionsChange(buffetVegetableSelections.filter(item => item !== value));
    } else if (buffetVegetableSelections.length < 2) {
      onBuffetVegetableSelectionsChange([...buffetVegetableSelections, value]);
    }
  };

  const handleStarchSelection = (value: string) => {
    if (buffetStarchSelections.includes(value)) {
      onBuffetStarchSelectionsChange(buffetStarchSelections.filter(item => item !== value));
    } else if (buffetStarchSelections.length < 2) {
      onBuffetStarchSelectionsChange([...buffetStarchSelections, value]);
    }
  };

  const renderSelectionSection = (
    title: string,
    selections: string[],
    options: typeof buffetMeatOptions,
    onSelect: (value: string) => void,
    maxSelections: number = 2
  ) => (
    <div className="space-y-1">
      <h4 className="text-xs font-medium text-zinc-500">{title}</h4>
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
    <div className="space-y-4">
      {renderSelectionSection(
        "MEAT SELECTION",
        buffetMeatSelections,
        buffetMeatOptions,
        handleMeatSelection
      )}
      
      {renderSelectionSection(
        "VEGETABLES",
        buffetVegetableSelections,
        buffetVegetableOptions,
        handleVegetableSelection
      )}
      
      {renderSelectionSection(
        "STARCH",
        buffetStarchSelections,
        buffetStarchOptions,
        handleStarchSelection
      )}

      <div className="space-y-1">
        <h4 className="text-xs font-medium text-zinc-500">TABLE SALAD</h4>
        {!buffetSaladSelection ? (
          <MenuDropdown
            value={buffetSaladSelection}
            onValueChange={onBuffetSaladSelectionChange}
            options={saladOptions}
            placeholder="Choose one salad"
          />
        ) : (
          <SelectionDisplay
            label={saladOptions.find(opt => opt.value === buffetSaladSelection)?.label || ''}
            onRemove={() => onBuffetSaladSelectionChange('')}
          />
        )}
      </div>
    </div>
  );
};

export default BuffetSection;