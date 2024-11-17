import React from 'react';
import { otherOptions } from './MenuTypes';
import { Input } from "@/components/ui/input";

interface OtherOptionsSectionProps {
  quantities: Record<string, number>;
  onQuantityChange: (optionId: string, quantity: number) => void;
}

const OtherOptionsSection = ({
  quantities,
  onQuantityChange,
}: OtherOptionsSectionProps) => {
  const handleQuantityChange = (optionId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    if (quantity >= 0) {
      onQuantityChange(optionId, quantity);
    }
  };

  const getOptionLabel = (value: string) => {
    const option = otherOptions.find(opt => opt.value === value);
    return option ? `${option.label} - R ${option.price.toFixed(2)} ${option.priceType === 'per_person' ? 'per person' : 'per item'}` : '';
  };

  return (
    <div className="space-y-2.5">
      {otherOptions.map((option) => (
        <div key={option.value} className="flex items-center justify-between gap-4">
          <div className="flex-grow">
            <span className="text-sm text-zinc-700">{getOptionLabel(option.value)}</span>
          </div>
          <Input
            type="number"
            min="0"
            value={quantities[option.value] || 0}
            onChange={(e) => handleQuantityChange(option.value, e.target.value)}
            className="w-10 h-7 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-zinc-200"
          />
        </div>
      ))}
    </div>
  );
};

export default OtherOptionsSection;