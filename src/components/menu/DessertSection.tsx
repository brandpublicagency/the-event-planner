import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                Select dessert type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[240px]">
              <DropdownMenuLabel>Dessert Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dessertTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => onDessertChange(type.value)}
                >
                  {type.label} - R {type.price.toFixed(2)} {type.priceType === 'per_person' ? 'per person' : 'per item'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  Select traditional dessert
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[240px]">
                <DropdownMenuLabel>Traditional Desserts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {traditionalDessertOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onTraditionalDessertChange(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  Select dessert canapé {selectedDessertCanapes.length + 1}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[240px]">
                <DropdownMenuLabel>Dessert Canapés</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dessertCanapeOptions
                  .filter(option => !selectedDessertCanapes.includes(option.value))
                  .map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleDessertCanapeToggle(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                Add individual cake
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[240px]">
              <DropdownMenuLabel>Individual Cakes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {individualCakeOptions
                .filter(option => !selectedIndividualCakes.includes(option.value))
                .map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleIndividualCakeToggle(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default DessertSection;