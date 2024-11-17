import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { otherOptions } from './MenuTypes';
import SelectionDisplay from './SelectionDisplay';

interface OtherOptionsSectionProps {
  selectedOptions: string[];
  onOptionsChange: (value: string[]) => void;
}

const OtherOptionsSection = ({
  selectedOptions,
  onOptionsChange,
}: OtherOptionsSectionProps) => {
  const handleOptionToggle = (value: string) => {
    if (selectedOptions.includes(value)) {
      onOptionsChange(selectedOptions.filter(option => option !== value));
    } else {
      onOptionsChange([...selectedOptions, value]);
    }
  };

  const getOptionLabel = (value: string) => {
    const option = otherOptions.find(opt => opt.value === value);
    return option ? `${option.label} - R ${option.price.toFixed(2)} ${option.priceType === 'per_person' ? 'per person' : 'per item'}` : '';
  };

  return (
    <div className="print:break-inside-avoid space-y-4">
      {selectedOptions.map((selection) => (
        <SelectionDisplay
          key={selection}
          label={getOptionLabel(selection)}
          onRemove={() => handleOptionToggle(selection)}
        />
      ))}
      
      <Select
        onValueChange={handleOptionToggle}
        value=""
      >
        <SelectTrigger>
          <SelectValue placeholder="Add additional option" />
        </SelectTrigger>
        <SelectContent>
          {otherOptions
            .filter(option => !selectedOptions.includes(option.value))
            .map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} - R {option.price.toFixed(2)} {option.priceType === 'per_person' ? 'per person' : 'per item'}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OtherOptionsSection;