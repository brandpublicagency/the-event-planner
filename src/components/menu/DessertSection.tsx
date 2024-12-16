import React from 'react';
import { dessertTypes, traditionalDessertOptions, dessertCanapeOptions, individualCakeOptions } from './MenuTypes';
import { Input } from "@/components/ui/input";
import SelectionDisplay from './SelectionDisplay';
import MenuDropdown from './common/MenuDropdown';

interface DessertSectionProps {
  selectedDessert: string;
  selectedTraditionalDessert?: string;
  selectedDessertCanapes?: string[];
  selectedIndividualCakes?: string[];
  onDessertChange: (value: string) => void;
  onTraditionalDessertChange: (value: string) => void;
  onDessertCanapesChange: (value: string[]) => void;
  onIndividualCakesChange: (value: string[]) => void;
}

const DessertSection = ({
  selectedDessert,
  selectedTraditionalDessert = '',
  selectedDessertCanapes = [],
  selectedIndividualCakes = [],
  onDessertChange,
  onTraditionalDessertChange,
  onDessertCanapesChange,
  onIndividualCakesChange,
}: DessertSectionProps) => {
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Initialize quantities based on selected cakes
    const initialQuantities: Record<string, number> = {};
    selectedIndividualCakes.forEach(cakeId => {
      initialQuantities[cakeId] = quantities[cakeId] || 1;
    });
    setQuantities(initialQuantities);
  }, [selectedIndividualCakes]);

  const handleDessertCanapeToggle = (value: string) => {
    if (selectedDessertCanapes.includes(value)) {
      onDessertCanapesChange(selectedDessertCanapes.filter(canape => canape !== value));
    } else if (selectedDessertCanapes.length < 3) {
      onDessertCanapesChange([...selectedDessertCanapes, value]);
    }
  };

  const handleQuantityChange = (optionId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    const newQuantities = { ...quantities, [optionId]: quantity };
    setQuantities(newQuantities);

    // Update selected cakes based on quantities
    const selectedCakes = Object.entries(newQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id]) => id);
    
    onIndividualCakesChange(selectedCakes);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {!selectedDessert ? (
          <MenuDropdown
            value={selectedDessert}
            onValueChange={onDessertChange}
            options={dessertTypes}
            placeholder="Select dessert option"
          />
        ) : (
          <SelectionDisplay
            label={`${dessertTypes.find(type => type.value === selectedDessert)?.label} - R ${dessertTypes.find(type => type.value === selectedDessert)?.price.toFixed(2)} ${dessertTypes.find(type => type.value === selectedDessert)?.priceType === 'per_person' ? 'per person' : 'per item'}`}
            onRemove={() => onDessertChange('')}
            actionLabel="Change"
          />
        )}
      </div>

      {selectedDessert === 'traditional' && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-zinc-500">TRADITIONAL BAKED DESSERT</div>
          {!selectedTraditionalDessert ? (
            <MenuDropdown
              value={selectedTraditionalDessert}
              onValueChange={onTraditionalDessertChange}
              options={traditionalDessertOptions}
              placeholder="Select traditional dessert"
            />
          ) : (
            <SelectionDisplay
              label={traditionalDessertOptions.find(opt => opt.value === selectedTraditionalDessert)?.label || ''}
              onRemove={() => onTraditionalDessertChange('')}
            />
          )}
        </div>
      )}

      {selectedDessert === 'canapes' && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-zinc-500">DESSERT CANAPÉS (Choose 3)</div>
          {selectedDessertCanapes.map((selection) => (
            <SelectionDisplay
              key={selection}
              label={dessertCanapeOptions.find(opt => opt.value === selection)?.label || ''}
              onRemove={() => handleDessertCanapeToggle(selection)}
            />
          ))}
          {selectedDessertCanapes.length < 3 && (
            <MenuDropdown
              value=""
              onValueChange={handleDessertCanapeToggle}
              options={dessertCanapeOptions.filter(option => !selectedDessertCanapes.includes(option.value))}
              placeholder="Select dessert canapé"
            />
          )}
        </div>
      )}

      {selectedDessert === 'cakes' && (
        <div className="space-y-1.5">
          {individualCakeOptions.map((option) => (
            <div key={option.value} className="flex items-center justify-between gap-4">
              <div className="flex-grow">
                <span className="text-sm text-zinc-700">{option.label}</span>
              </div>
              <Input
                type="number"
                min="0"
                value={quantities[option.value] || 0}
                onChange={(e) => handleQuantityChange(option.value, e.target.value)}
                className="w-10 h-7 text-center text-[0.7rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-zinc-200"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DessertSection;