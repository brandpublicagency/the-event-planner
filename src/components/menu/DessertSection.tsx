import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dessertTypes, traditionalDessertOptions, dessertCanapeOptions, individualCakeOptions } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
import SelectionDisplay from './SelectionDisplay';

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
        <SelectionHeader title="DESSERT TYPE" />
        {!selectedDessert ? (
          <Select value={selectedDessert} onValueChange={onDessertChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select dessert type" />
            </SelectTrigger>
            <SelectContent>
              {dessertTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label} - R {type.price.toFixed(2)} {type.priceType === 'per_person' ? 'per person' : 'per item'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <SelectionDisplay
            label={`${dessertTypes.find(type => type.value === selectedDessert)?.label} - R ${dessertTypes.find(type => type.value === selectedDessert)?.price.toFixed(2)} ${dessertTypes.find(type => type.value === selectedDessert)?.priceType === 'per_person' ? 'per person' : 'per item'}`}
            onRemove={() => {
              onDessertChange('');
              onTraditionalDessertChange('');
              onDessertCanapesChange([]);
              onIndividualCakesChange([]);
            }}
            actionLabel="Change"
          />
        )}
      </div>

      {selectedDessert === 'traditional' && (
        <div className="space-y-4">
          <SelectionHeader title="TRADITIONAL BAKED DESSERT" />
          {!selectedTraditionalDessert ? (
            <Select value={selectedTraditionalDessert} onValueChange={onTraditionalDessertChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select traditional dessert" />
              </SelectTrigger>
              <SelectContent>
                {traditionalDessertOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <SelectionDisplay
              label={traditionalDessertOptions.find(opt => opt.value === selectedTraditionalDessert)?.label || ''}
              onRemove={() => onTraditionalDessertChange('')}
              actionLabel="Change"
            />
          )}
        </div>
      )}

      {selectedDessert === 'canapes' && (
        <div className="space-y-4">
          <SelectionHeader title="DESSERT CANAPÉS (Choose 3)" />
          {selectedDessertCanapes.map((selection) => (
            <SelectionDisplay
              key={selection}
              label={dessertCanapeOptions.find(opt => opt.value === selection)?.label || ''}
              onRemove={() => handleDessertCanapeToggle(selection)}
            />
          ))}
          {selectedDessertCanapes.length < 3 && (
            <Select
              value=""
              onValueChange={handleDessertCanapeToggle}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select dessert canapé ${selectedDessertCanapes.length + 1}`} />
              </SelectTrigger>
              <SelectContent>
                {dessertCanapeOptions
                  .filter(option => !selectedDessertCanapes.includes(option.value))
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {selectedDessert === 'cakes' && (
        <div className="space-y-4">
          <SelectionHeader title="INDIVIDUAL CAKES" />
          {selectedIndividualCakes.map((selection) => (
            <SelectionDisplay
              key={selection}
              label={individualCakeOptions.find(opt => opt.value === selection)?.label || ''}
              onRemove={() => handleIndividualCakeToggle(selection)}
            />
          ))}
          <Select
            value=""
            onValueChange={handleIndividualCakeToggle}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add individual cake" />
            </SelectTrigger>
            <SelectContent>
              {individualCakeOptions
                .filter(option => !selectedIndividualCakes.includes(option.value))
                .map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default DessertSection;