
import React from 'react';

interface SelectionDisplayProps {
  label: string;
  onRemove: () => void;
  actionLabel?: string;
  isBold?: boolean;
}

const SelectionDisplay = ({ 
  label, 
  onRemove, 
  actionLabel = "Change",
  isBold = false
}: SelectionDisplayProps) => {
  return (
    <div className="flex justify-between items-center py-0.5">
      <div className="flex-1">
        <span className={`text-sm ${isBold ? 'font-semibold' : 'font-normal'}`}>{label}</span>
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
