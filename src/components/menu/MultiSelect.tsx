import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
  actionLabel?: string;
}

const MultiSelect = ({ 
  options, 
  selectedValues, 
  onChange, 
  maxSelections,
  actionLabel = "Remove"
}: MultiSelectProps) => {
  const handleOptionToggle = (value: string, checked: boolean) => {
    if (checked) {
      if (!maxSelections || selectedValues.length < maxSelections) {
        onChange([...selectedValues, value]);
      }
    } else {
      onChange(selectedValues.filter(item => item !== value));
    }
  };

  return (
    <div className="space-y-2">
      {selectedValues.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => onChange([])}
            className="text-sm text-red-500 hover:text-red-600"
          >
            {actionLabel} All
          </button>
        </div>
      )}
      <div className="grid gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
          >
            <Checkbox
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => handleOptionToggle(option.value, checked as boolean)}
              disabled={maxSelections ? selectedValues.length >= maxSelections && !selectedValues.includes(option.value) : false}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;