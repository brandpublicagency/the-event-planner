import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { platedStarterOptions } from './MenuTypes';

interface PlatedStarterSectionProps {
  selectedPlatedStarter: string;
  onPlatedStarterChange: (value: string) => void;
}

const PlatedStarterSection = ({
  selectedPlatedStarter,
  onPlatedStarterChange,
}: PlatedStarterSectionProps) => {
  return (
    <div className="print:break-inside-avoid">
      <Select value={selectedPlatedStarter} onValueChange={onPlatedStarterChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your plated starter" />
        </SelectTrigger>
        <SelectContent>
          {platedStarterOptions.map((starter) => (
            <SelectItem key={starter.value} value={starter.value}>
              {starter.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PlatedStarterSection;