import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { starterTypes } from './MenuTypes';

interface StarterTypeSelectProps {
  selectedStarterType: string;
  onStarterTypeChange: (value: string) => void;
}

const StarterTypeSelect = ({
  selectedStarterType,
  onStarterTypeChange,
}: StarterTypeSelectProps) => {
  return (
    <div className="print:break-inside-avoid">
      <Select value={selectedStarterType} onValueChange={onStarterTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your starter type" />
        </SelectTrigger>
        <SelectContent>
          {starterTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex justify-between items-center w-full">
                <span>{type.label}</span>
                <span className="text-sm text-zinc-500">R {type.price}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StarterTypeSelect;