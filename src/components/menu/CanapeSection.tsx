
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
  // Log state changes for debugging
  useEffect(() => {
    console.log(`CanapeSection rendered with package: ${selectedCanapePackage}, selections:`, selectedCanapes);
  }, [selectedCanapePackage, selectedCanapes]);

  // Validate canape selections when the package changes
  useEffect(() => {
    if (selectedCanapePackage) {
      const maxCanapes = parseInt(selectedCanapePackage, 10);
      
      // Log for debugging
      console.log(`Canape package selected: ${selectedCanapePackage}, allows ${maxCanapes} canapes`);
      console.log(`Current selections: ${JSON.stringify(selectedCanapes)}`);
      
      // Ensure we don't have more selections than allowed by the package
      if (Array.isArray(selectedCanapes) && selectedCanapes.length > maxCanapes) {
        console.log(`Trimming canape selections from ${selectedCanapes.length} to ${maxCanapes}`);
        
        // Use a timeout to avoid React state update conflicts
        setTimeout(() => {
          // Get the first maxCanapes items from the array
          const trimmedSelections = selectedCanapes.slice(0, maxCanapes);
          
          // Update each position individually
          trimmedSelections.forEach((value, index) => {
            if (value) {
              onCanapeSelection(index + 1, value);
            }
          });
        }, 0);
      }
    }
  }, [selectedCanapePackage, selectedCanapes, onCanapeSelection]);

  // Helper function to get the actual number of canape slots
  const getCanapeSlots = () => {
    if (!selectedCanapePackage) return 0;
    return parseInt(selectedCanapePackage, 10);
  };

  // Helper function to get currently used canape options
  const getUsedCanapeOptions = () => {
    if (!selectedCanapes || !Array.isArray(selectedCanapes)) return [];
    return selectedCanapes.filter(Boolean);
  };

  // Helper function to get available canape options (excluding already selected ones)
  const getAvailableOptions = (currentPosition: number) => {
    const usedOptions = getUsedCanapeOptions();
    
    // For the current position, we need to include its current value in the available options
    const currentPositionValue = selectedCanapes && selectedCanapes.length > currentPosition - 1 
      ? selectedCanapes[currentPosition - 1] 
      : '';
    
    return canapeOptions.filter(option => {
      // Always include the current value for this position in available options
      if (option.value === currentPositionValue) return true;
      
      // Exclude options that are already selected in other positions
      return !usedOptions.includes(option.value);
    });
  };

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
          {Array.from({ length: getCanapeSlots() }).map((_, index) => {
            const position = index + 1;
            // Ensure we're mapping to the correct positions
            const canapeValue = selectedCanapes && position <= selectedCanapes.length 
              ? selectedCanapes[index] 
              : '';
            
            return (
              <div key={`canape-${position}`}>
                {!canapeValue ? (
                  <MenuDropdown
                    value={canapeValue}
                    onValueChange={(value) => {
                      console.log(`Selected canape #${position}: ${value}`);
                      onCanapeSelection(position, value);
                    }}
                    options={getAvailableOptions(position)}
                    placeholder={`Select canapé ${position}`}
                  />
                ) : (
                  <SelectionDisplay
                    label={canapeOptions.find(opt => opt.value === canapeValue)?.label || ''}
                    onRemove={() => {
                      console.log(`Removing canape #${position}`);
                      onCanapeSelection(position, '');
                    }}
                    actionLabel="Change"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CanapeSection;
