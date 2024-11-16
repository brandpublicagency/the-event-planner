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
    <div className="print:break-inside-avoid mt-2">
      <Select value={selectedStarterType} onValueChange={onStarterTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your starter type" />
        </SelectTrigger>
        <SelectContent>
          {starterTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label} - R {type.price.toFixed(2)} per person
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StarterTypeSelect;