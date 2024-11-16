import React from 'react';
import { Label } from "@/components/ui/label";
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
  const selectedType = dessertTypes.find(type => type.value === selectedDessert);

  return (
    <div className="print:break-inside-avoid">
      <div>
        <Label className="text-sm text-muted-foreground mb-4 block">
          {selectedType 
            ? `${selectedType.label} - R ${selectedType.price.toFixed(2)} ${selectedType.priceType === 'per_person' ? 'per person' : 'per item'}`
            : 'Select your dessert option'}
        </Label>
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
    </div>
  );
};

export default DessertSection;