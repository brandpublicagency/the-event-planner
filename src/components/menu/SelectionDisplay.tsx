import React from 'react';

interface SelectionDisplayProps {
  label: string;
  onRemove: () => void;
  actionLabel?: string;
}

const SelectionDisplay = ({ label, onRemove, actionLabel = "Remove" }: SelectionDisplayProps) => {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="text-sm text-red-500 hover:text-red-600"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default SelectionDisplay;