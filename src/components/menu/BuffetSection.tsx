import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buffetMeatOptions, buffetVegetableOptions, buffetStarchOptions, saladOptions } from './MenuTypes';

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-zinc-500">MEAT SELECTION</h4>
        {buffetMeatSelections.length === 0 ? (
          <Select onValueChange={handleMeatSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Choose meat option (select 2)" />
            </SelectTrigger>
            <SelectContent>
              {buffetMeatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2">
            {buffetMeatSelections.map((selection) => {
              const option = buffetMeatOptions.find(opt => opt.value === selection);
              return (
                <div key={selection} className="flex justify-between items-center">
                  <span>{option?.label}</span>
                  <button
                    onClick={() => handleMeatSelection(selection)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            {buffetMeatSelections.length < 2 && (
              <Select onValueChange={handleMeatSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Add another meat option" />
                </SelectTrigger>
                <SelectContent>
                  {buffetMeatOptions
                    .filter(option => !buffetMeatSelections.includes(option.value))
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
        <h4 className="text-sm font-medium text-zinc-500">VEGETABLES</h4>
        {buffetVegetableSelections.length === 0 ? (
          <Select onValueChange={handleVegetableSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Choose vegetable option (select 2)" />
            </SelectTrigger>
            <SelectContent>
              {buffetVegetableOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2">
            {buffetVegetableSelections.map((selection) => {
              const option = buffetVegetableOptions.find(opt => opt.value === selection);
              return (
                <div key={selection} className="flex justify-between items-center">
                  <span>{option?.label}</span>
                  <button
                    onClick={() => handleVegetableSelection(selection)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            {buffetVegetableSelections.length < 2 && (
              <Select onValueChange={handleVegetableSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Add another vegetable option" />
                </SelectTrigger>
                <SelectContent>
                  {buffetVegetableOptions
                    .filter(option => !buffetVegetableSelections.includes(option.value))
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
        <h4 className="text-sm font-medium text-zinc-500">STARCH</h4>
        {buffetStarchSelections.length === 0 ? (
          <Select onValueChange={handleStarchSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Choose starch option (select 2)" />
            </SelectTrigger>
            <SelectContent>
              {buffetStarchOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2">
            {buffetStarchSelections.map((selection) => {
              const option = buffetStarchOptions.find(opt => opt.value === selection);
              return (
                <div key={selection} className="flex justify-between items-center">
                  <span>{option?.label}</span>
                  <button
                    onClick={() => handleStarchSelection(selection)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            {buffetStarchSelections.length < 2 && (
              <Select onValueChange={handleStarchSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Add another starch option" />
                </SelectTrigger>
                <SelectContent>
                  {buffetStarchOptions
                    .filter(option => !buffetStarchSelections.includes(option.value))
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
        <h4 className="text-sm font-medium text-zinc-500">TABLE SALAD</h4>
        {!buffetSaladSelection ? (
          <Select value={buffetSaladSelection} onValueChange={onBuffetSaladSelectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose one salad" />
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
          <div className="flex justify-between items-center">
            <span>{saladOptions.find(opt => opt.value === buffetSaladSelection)?.label}</span>
            <button
              onClick={() => onBuffetSaladSelectionChange('')}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuffetSection;