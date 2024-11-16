import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { platedMainOptions, saladOptions } from './MenuTypes';

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
        <Label>MAIN COURSE - CHOOSE ONE OPTION</Label>
        <Select value={platedMainSelection} onValueChange={onPlatedMainSelectionChange}>
          <SelectTrigger className="w-full">
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
      </div>

      <div className="space-y-4">
        <Label>CHOOSE ONE SALAD SERVED TO THE TABLE</Label>
        <Select value={platedSaladSelection} onValueChange={onPlatedSaladSelectionChange}>
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

export default PlatedSection;