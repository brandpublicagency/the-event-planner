import React from 'react';
import { dessertTypes, traditionalDessertOptions, dessertCanapeOptions, individualCakeOptions } from './MenuTypes';
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
  const handleDessertCanapeToggle = (value: string) => {
    if (selectedDessertCanapes.includes(value)) {
      onDessertCanapesChange(selectedDessertCanapes.filter(canape => canape !== value));
    } else if (selectedDessertCanapes.length < 3) {
      onDessertCanapesChange([...selectedDessertCanapes, value]);
    }
  };

  const handleIndividualCakeToggle = (value: string) => {
    if (selectedIndividualCakes.includes(value)) {
      onIndividualCakesChange(selectedIndividualCakes.filter(cake => cake !== value));
    } else {
      onIndividualCakesChange([...selectedIndividualCakes, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {!selectedDessert ? (
          <MenuDropdown
            value={selectedDessert}
            onValueChange={onDessertChange}
            options={dessertTypes}
            placeholder="Select dessert type"
          />
        ) : (
          <div>
            <div className="text-zinc-600 mb-2">DESSERT TYPE</div>
            <SelectionDisplay
              label={`${dessertTypes.find(type => type.value === selectedDessert)?.label} - R ${dessertTypes.find(type => type.value === selectedDessert)?.price.toFixed(2)} ${dessertTypes.find(type => type.value === selectedDessert)?.priceType === 'per_person' ? 'per person' : 'per item'}`}
              onRemove={() => onDessertChange('')}
              actionLabel="Change"
            />
          </div>
        )}
      </div>

      {selectedDessert === 'traditional' && (
        <div className="space-y-4">
          <div className="text-zinc-600 mb-2">TRADITIONAL BAKED DESSERT</div>
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
        <div className="space-y-4">
          <div className="text-zinc-600 mb-2">DESSERT CANAPÉS (Choose 3)</div>
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
        <div className="space-y-4">
          <div className="text-zinc-600 mb-2">INDIVIDUAL CAKES</div>
          {selectedIndividualCakes.map((selection) => (
            <SelectionDisplay
              key={selection}
              label={individualCakeOptions.find(opt => opt.value === selection)?.label || ''}
              onRemove={() => handleIndividualCakeToggle(selection)}
            />
          ))}
          <MenuDropdown
            value=""
            onValueChange={handleIndividualCakeToggle}
            options={individualCakeOptions.filter(option => !selectedIndividualCakes.includes(option.value))}
            placeholder="Add individual cake"
          />
        </div>
      )}
    </div>
  );
};

export default DessertSection;