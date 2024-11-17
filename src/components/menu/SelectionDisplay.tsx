import React from 'react';

interface SelectionDisplayProps {
  label: string;
  price?: { value: number; type: 'per_person' | 'per_item' };
  onRemove: () => void;
  actionLabel?: string;
  showPrice?: boolean;
  isBold?: boolean;
}

const SelectionDisplay = ({ 
  label, 
  price,
  onRemove, 
  actionLabel = "Change",
  showPrice = false,
  isBold = false
}: SelectionDisplayProps) => {
  const formatPrice = (price: { value: number; type: 'per_person' | 'per_item' }) => {
    return `R ${price.value.toFixed(2)} ${price.type === 'per_person' ? 'per person' : 'per item'}`;
  };

  return (
    <div className="flex justify-between items-center py-0.5">
      <div className="flex-1">
        <span className={`text-sm ${isBold ? 'font-semibold' : 'font-normal'}`}>{label}</span>
        {showPrice && price && (
          <span className="text-xs text-muted-foreground ml-2">
            ({formatPrice(price)})
          </span>
        )}
      </div>
      <button
        onClick={onRemove}
        className="text-xs text-zinc-300 hover:text-zinc-500 ml-4"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default SelectionDisplay;