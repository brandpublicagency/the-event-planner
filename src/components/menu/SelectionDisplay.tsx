import React from 'react';

interface SelectionDisplayProps {
  label: string;
  onRemove: () => void;
}

const SelectionDisplay = ({ label, onRemove }: SelectionDisplayProps) => {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="text-sm text-red-500 hover:text-red-600"
      >
        Remove
      </button>
    </div>
  );
};

export default SelectionDisplay;