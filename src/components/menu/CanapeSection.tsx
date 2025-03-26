
import React, { useEffect } from 'react';
import { canapePackages, canapeOptions } from './types/starterOptions';
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
  // Validate canape selections when the package changes
  useEffect(() => {
    if (selectedCanapePackage) {
      const maxCanapes = parseInt(selectedCanapePackage, 10);
      
      // Log for debugging
      console.log(`Canape package selected: ${selectedCanapePackage}, allows ${maxCanapes} canapes`);
      console.log(`Current selections: ${JSON.stringify(selectedCanapes)}`);
      
      // Ensure we don't have more selections than allowed by the package
      if (selectedCanapes.length > maxCanapes) {
        console.log(`Trimming canape selections from ${selectedCanapes.length} to ${maxCanapes}`);
        const trimmedSelections = selectedCanapes.slice(0, maxCanapes);
        // Use a timeout to avoid React state update conflicts
        setTimeout(() => {
          const updatedCanapes = [...trimmedSelections];
          while (updatedCanapes.length < maxCanapes) {
            updatedCanapes.push('');
          }
          
          // Update each position individually to maintain indices
          updatedCanapes.forEach((value, index) => {
            onCanapeSelection(index + 1, value);
          });
        }, 0);
      }
    }
  }, [selectedCanapePackage, selectedCanapes, onCanapeSelection]);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {!selectedCanapePackage ? (
          <MenuDropdown
            value={selectedCanapePackage}
            onValueChange={onCanapePackageChange}
            options={canapePackages}
            placeholder="Select number of canapés"
          />
        ) : (
          <div>
            <SelectionDisplay
              label={`${canapePackages.find(pkg => pkg.value === selectedCanapePackage)?.label || ''}`}
              onRemove={() => onCanapePackageChange('')}
              actionLabel="Change"
              isBold={true}
            />
          </div>
        )}
      </div>

      {selectedCanapePackage && (
        <div className="space-y-1 mt-1">
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
                  actionLabel="Change"
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
