import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { karooVegetableOptions } from '../MenuTypes';

interface KarooVegetableSelectProps {
  selections: string[];
  onSelectionsChange: (value: string[]) => void;
}

const KarooVegetableSelect = ({ selections, onSelectionsChange }: KarooVegetableSelectProps) => {
  const handleOptionToggle = (value: string, checked: boolean) => {
    if (checked) {
      if (selections.length < 2) {
        onSelectionsChange([...selections, value]);
      }
    } else {
      onSelectionsChange(selections.filter(item => item !== value));
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-zinc-600 mb-2">VEGETABLES</div>
      <div className="grid gap-3">
        {karooVegetableOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
          >
            <Checkbox
              checked={selections.includes(option.value)}
              onCheckedChange={(checked) => handleOptionToggle(option.value, checked as boolean)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default KarooVegetableSelect;