import React from 'react';
import { canapePackages, canapeOptions } from './MenuTypes';
import SelectionDisplay from './SelectionDisplay';
import MenuDropdown from './common/MenuDropdown';

interface CanapeSectionProps {
  selectedCanapePackage: string;
  selectedCanapes: string[];
  onCanapePackageChange: (value: string) => void;
  onCanapeSelection: (position: number, value: string) => void;
}

const CanapeSection = ({
  selectedCanapePackage,
  selectedCanapes,
  onCanapePackageChange,
  onCanapeSelection,
}: CanapeSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {!selectedCanapePackage ? (
          <MenuDropdown
            value={selectedCanapePackage}
            onValueChange={onCanapePackageChange}
            options={canapePackages.map(pkg => ({
              value: pkg.value,
              label: pkg.label,
              price: pkg.price,
              priceType: 'per_person'
            }))}
            placeholder="Select number of canapés"
          />
        ) : (
          <div>
            <SelectionDisplay
              label={`${canapePackages.find(pkg => pkg.value === selectedCanapePackage)?.label} - R ${canapePackages.find(pkg => pkg.value === selectedCanapePackage)?.price.toFixed(2)} per person`}
              onRemove={() => onCanapePackageChange('')}
              actionLabel="Change"
            />
          </div>
        )}
      </div>

      {selectedCanapePackage && (
        <div className="space-y-3">
          {Array.from({ length: parseInt(selectedCanapePackage) }).map((_, index) => (
            <div key={index}>
              {!selectedCanapes[index] ? (
                <MenuDropdown
                  value={selectedCanapes[index] || ''}
                  onValueChange={(value) => onCanapeSelection(index + 1, value)}
                  options={canapeOptions
                    .filter(option => !selectedCanapes.includes(option.value))
                    .map(canape => ({
                      value: canape.value,
                      label: canape.label
                    }))}
                  placeholder={`Select canapé ${index + 1}`}
                />
              ) : (
                <SelectionDisplay
                  label={canapeOptions.find(opt => opt.value === selectedCanapes[index])?.label || ''}
                  onRemove={() => onCanapeSelection(index + 1, '')}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CanapeSection;