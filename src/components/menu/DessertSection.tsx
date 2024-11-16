import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dessertTypes } from './MenuTypes';

interface DessertSectionProps {
  selectedDessert: string;
  onDessertChange: (value: string) => void;
}

const DessertSection = ({
  selectedDessert,
  onDessertChange,
}: DessertSectionProps) => {
  return (
    <div className="print:break-inside-avoid">
      <Select value={selectedDessert} onValueChange={onDessertChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select dessert option" />
        </SelectTrigger>
        <SelectContent>
          {dessertTypes.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label} - R {option.price.toFixed(2)} {option.priceType === 'per_person' ? 'per person' : 'per item'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DessertSection;