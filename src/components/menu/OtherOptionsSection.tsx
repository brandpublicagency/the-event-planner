import React from 'react';
import { otherOptions } from './MenuTypes';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface OtherOptionsSectionProps {
  selectedOptions: string[];
  quantities: Record<string, number>;
  onOptionsChange: (value: string[]) => void;
  onQuantityChange: (optionId: string, quantity: number) => void;
}

const OtherOptionsSection = ({
  selectedOptions,
  quantities,
  onOptionsChange,
  onQuantityChange,
}: OtherOptionsSectionProps) => {
  const handleOptionToggle = (value: string) => {
    if (selectedOptions.includes(value)) {
      onOptionsChange(selectedOptions.filter(option => option !== value));
    } else {
      onOptionsChange([...selectedOptions, value]);
      onQuantityChange(value, 1); // Set default quantity to 1 when adding
    }
  };

  const handleQuantityChange = (optionId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    if (quantity >= 0) {
      onQuantityChange(optionId, quantity);
    }
  };

  const incrementQuantity = (optionId: string) => {
    const currentQuantity = quantities[optionId] || 0;
    onQuantityChange(optionId, currentQuantity + 1);
  };

  const decrementQuantity = (optionId: string) => {
    const currentQuantity = quantities[optionId] || 0;
    if (currentQuantity > 1) {
      onQuantityChange(optionId, currentQuantity - 1);
    }
  };

  const getOptionLabel = (value: string) => {
    const option = otherOptions.find(opt => opt.value === value);
    return option ? `${option.label} - R ${option.price.toFixed(2)} ${option.priceType === 'per_person' ? 'per person' : 'per item'}` : '';
  };

  return (
    <div className="print:break-inside-avoid space-y-4">
      {selectedOptions.map((selection) => (
        <div key={selection} className="flex items-center gap-4 bg-zinc-50 p-3 rounded-lg">
          <div className="flex-grow">
            <Label>{getOptionLabel(selection)}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`qty-${selection}`} className="text-sm text-muted-foreground whitespace-nowrap">
              Qty:
            </Label>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => decrementQuantity(selection)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id={`qty-${selection}`}
                type="number"
                min="1"
                value={quantities[selection] || 1}
                onChange={(e) => handleQuantityChange(selection, e.target.value)}
                className="w-16 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => incrementQuantity(selection)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <button
              onClick={() => handleOptionToggle(selection)}
              className="text-sm text-red-500 hover:text-red-600 ml-2"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      
      {otherOptions.filter(option => !selectedOptions.includes(option.value)).length > 0 && (
        <div className="mt-2">
          <Label className="text-sm text-muted-foreground mb-2">Add additional options:</Label>
          <div className="space-y-2">
            {otherOptions
              .filter(option => !selectedOptions.includes(option.value))
              .map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionToggle(option.value)}
                  className="w-full text-left p-2 hover:bg-zinc-50 rounded-md transition-colors"
                >
                  {option.label} - R {option.price.toFixed(2)} {option.priceType === 'per_person' ? 'per person' : 'per item'}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherOptionsSection;