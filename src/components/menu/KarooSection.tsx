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
        {karooStarchSelection.length === 0 ? (
          <Select onValueChange={handleStarchSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Choose starch option (select 2)" />
            </SelectTrigger>
            <SelectContent>
              {karooStarchOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2">
            {karooStarchSelection.map((selection) => {
              const option = karooStarchOptions.find(opt => opt.value === selection);
              return (
                <div key={selection} className="flex justify-between items-center">
                  <span>{option?.label}</span>
                  <button
                    onClick={() => handleStarchSelection(selection)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Change
                  </button>
                </div>
              );
            })}
            {karooStarchSelection.length < 2 && (
              <Select onValueChange={handleStarchSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Add another starch option" />
                </SelectTrigger>
                <SelectContent>
                  {karooStarchOptions
                    .filter(option => !karooStarchSelection.includes(option.value))
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <SelectionHeader title="VEGETABLE SELECTIONS (Select 2)" />
        {karooVegetableSelections.length === 0 ? (
          <Select onValueChange={handleVegetableSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Choose vegetable option (select 2)" />
            </SelectTrigger>
            <SelectContent>
              {karooVegetableOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2">
            {karooVegetableSelections.map((selection) => {
              const option = karooVegetableOptions.find(opt => opt.value === selection);
              return (
                <div key={selection} className="flex justify-between items-center">
                  <span>{option?.label}</span>
                  <button
                    onClick={() => handleVegetableSelection(selection)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Change
                  </button>
                </div>
              );
            })}
            {karooVegetableSelections.length < 2 && (
              <Select onValueChange={handleVegetableSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Add another vegetable option" />
                </SelectTrigger>
                <SelectContent>
                  {karooVegetableOptions
                    .filter(option => !karooVegetableSelections.includes(option.value))
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
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