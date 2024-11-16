import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { otherOptions } from './MenuTypes';

interface OtherOptionsSectionProps {
  selectedOptions: string[];
  onOptionsChange: (value: string[]) => void;
}

const OtherOptionsSection = ({
  selectedOptions,
  onOptionsChange,
}: OtherOptionsSectionProps) => {
  const handleOptionToggle = (value: string, checked: boolean) => {
    if (checked) {
      onOptionsChange([...selectedOptions, value]);
    } else {
      onOptionsChange(selectedOptions.filter(option => option !== value));
    }
  };

  return (
    <div className="print:break-inside-avoid space-y-3">
      {otherOptions.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
        >
          <Checkbox
            checked={selectedOptions.includes(option.value)}
            onCheckedChange={(checked) => handleOptionToggle(option.value, checked as boolean)}
          />
          <span className="flex-1">
            {option.label} - R {option.price.toFixed(2)} {option.priceType === 'per_person' ? 'per person' : 'per item'}
          </span>
        </label>
      ))}
    </div>
  );
};

export default OtherOptionsSection;