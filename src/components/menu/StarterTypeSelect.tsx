import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { starterTypes } from './MenuTypes';

interface StarterTypeSelectProps {
  selectedStarterType: string;
  onStarterTypeChange: (value: string) => void;
}

const StarterTypeSelect = ({
  selectedStarterType,
  onStarterTypeChange,
}: StarterTypeSelectProps) => {
  const selectedType = starterTypes.find(s => s.value === selectedStarterType);

  if (selectedType) {
    return (
      <div className="flex items-center justify-between bg-white border rounded-md p-3">
        <span>{selectedType.label} - R {selectedType.price.toFixed(2)} per person</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStarterTypeChange('')}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

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