import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { starterTypes } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
import SelectionDisplay from './SelectionDisplay';

interface StarterTypeSelectProps {
  selectedStarterType: string;
  onStarterTypeChange: (value: string) => void;
}

const StarterTypeSelect = ({
  selectedStarterType,
  onStarterTypeChange,
}: StarterTypeSelectProps) => {
  const selectedType = starterTypes.find(s => s.value === selectedStarterType);

  return (
    <div className="space-y-4">
      <SelectionHeader title="STARTER TYPE" />
      {!selectedStarterType ? (
        <Select value={selectedStarterType} onValueChange={onStarterTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose starter option" />
          </SelectTrigger>
          <SelectContent>
            {starterTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <SelectionDisplay
          label={`${selectedType?.label}`}
          onRemove={() => onStarterTypeChange('')}
          actionLabel="Change"
        />
      )}
    </div>
  );
};

export default StarterTypeSelect;