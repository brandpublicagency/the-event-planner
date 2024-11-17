import React from 'react';

interface SelectionDisplayProps {
  label: string;
  price?: { value: number; type: 'per_person' | 'per_item' };
  onRemove: () => void;
  actionLabel?: string;
}

const SelectionDisplay = ({ 
  label, 
  price,
  onRemove, 
  actionLabel = "Remove" 
}: SelectionDisplayProps) => {
  const formatPrice = (price: { value: number; type: 'per_person' | 'per_item' }) => {
    return `R ${price.value.toFixed(2)} ${price.type === 'per_person' ? 'per person' : 'per item'}`;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <span>{label}</span>
        {price && (
          <span className="text-sm text-muted-foreground ml-2">
            ({formatPrice(price)})
          </span>
        )}
      </div>
      <button
        onClick={onRemove}
        className="text-sm text-red-500 hover:text-red-600 ml-4"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default SelectionDisplay;