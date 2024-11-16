import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  const handleOptionToggle = (
    currentSelections: string[],
    value: string,
    onChange: (value: string[]) => void,
    maxSelections: number
  ) => {
    if (currentSelections.includes(value)) {
      onChange(currentSelections.filter(item => item !== value));
    } else if (currentSelections.length < maxSelections) {
      onChange([...currentSelections, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>MEAT SELECTION - CHOOSE TWO OPTIONS</Label>
        <div className="grid gap-3">
          {buffetMeatOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
            >
              <Checkbox
                checked={buffetMeatSelections.includes(option.value)}
                onCheckedChange={() => 
                  handleOptionToggle(buffetMeatSelections, option.value, onBuffetMeatSelectionsChange, 2)
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>VEGETABLES - CHOOSE TWO OPTIONS</Label>
        <div className="grid gap-3">
          {buffetVegetableOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
            >
              <Checkbox
                checked={buffetVegetableSelections.includes(option.value)}
                onCheckedChange={() => 
                  handleOptionToggle(buffetVegetableSelections, option.value, onBuffetVegetableSelectionsChange, 2)
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>STARCH SELECTION - CHOOSE TWO OPTIONS</Label>
        <div className="grid gap-3">
          {buffetStarchOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
            >
              <Checkbox
                checked={buffetStarchSelections.includes(option.value)}
                onCheckedChange={() => 
                  handleOptionToggle(buffetStarchSelections, option.value, onBuffetStarchSelectionsChange, 2)
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>CHOOSE ONE SALAD SERVED TO THE TABLE</Label>
        <Select value={buffetSaladSelection} onValueChange={onBuffetSaladSelectionChange}>
          <SelectTrigger className="w-full">
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
      </div>
    </div>
  );
};

export default BuffetSection;