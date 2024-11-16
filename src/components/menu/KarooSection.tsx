import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { karooMeatOptions, karooStarchOptions, karooVegetableOptions, saladOptions } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
import SelectionDisplay from './SelectionDisplay';
import MultiSelect from './MultiSelect';

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
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SelectionHeader title="MEAT SELECTION" />
        {!karooMeatSelection ? (
          <Select value={karooMeatSelection} onValueChange={onKarooMeatSelectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select meat option" />
            </SelectTrigger>
            <SelectContent>
              {karooMeatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <SelectionDisplay
            label={karooMeatOptions.find(opt => opt.value === karooMeatSelection)?.label || ''}
            onRemove={() => onKarooMeatSelectionChange('')}
            actionLabel="Change"
          />
        )}
      </div>

      <div className="space-y-4">
        <SelectionHeader title="STARCH SELECTIONS (Select 2)" />
        <MultiSelect
          options={karooStarchOptions}
          selectedValues={karooStarchSelection}
          onChange={onKarooStarchSelectionChange}
          maxSelections={2}
          actionLabel="Change"
        />
      </div>

      <div className="space-y-4">
        <SelectionHeader title="VEGETABLE SELECTIONS (Select 2)" />
        <MultiSelect
          options={karooVegetableOptions}
          selectedValues={karooVegetableSelections}
          onChange={onKarooVegetableSelectionsChange}
          maxSelections={2}
          actionLabel="Change"
        />
      </div>

      <div className="space-y-4">
        <SelectionHeader title="TABLE SALAD" />
        {!karooSaladSelection ? (
          <Select value={karooSaladSelection} onValueChange={onKarooSaladSelectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a salad" />
            </SelectTrigger>
            <SelectContent>
              {saladOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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