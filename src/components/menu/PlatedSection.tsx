import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { platedMainOptions, saladOptions } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
import SelectionDisplay from './SelectionDisplay';

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
          <Select value={platedMainSelection} onValueChange={onPlatedMainSelectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select main course" />
            </SelectTrigger>
            <SelectContent>
              {platedMainOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select value={platedSaladSelection} onValueChange={onPlatedSaladSelectionChange}>
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
            label={saladOptions.find(opt => opt.value === platedSaladSelection)?.label || ''}
            onRemove={() => onPlatedSaladSelectionChange('')}
          />
        )}
      </div>
    </div>
  );
};

export default PlatedSection;