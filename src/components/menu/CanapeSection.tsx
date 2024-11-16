import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { canapePackages, canapeOptions } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
import SelectionDisplay from './SelectionDisplay';

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
        <SelectionHeader title="NUMBER OF CANAPÉS" />
        {!selectedCanapePackage ? (
          <Select value={selectedCanapePackage} onValueChange={onCanapePackageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select number of canapés" />
            </SelectTrigger>
            <SelectContent>
              {canapePackages.map((pkg) => (
                <SelectItem key={pkg.value} value={pkg.value}>
                  {pkg.label} - R {pkg.price.toFixed(2)} per person
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <SelectionDisplay
            label={`${canapePackages.find(pkg => pkg.value === selectedCanapePackage)?.label} - R ${canapePackages.find(pkg => pkg.value === selectedCanapePackage)?.price.toFixed(2)} per person`}
            onRemove={() => {
              onCanapePackageChange('');
            }}
            actionLabel="Change"
          />
        )}
      </div>

      {selectedCanapePackage && (
        <div className="space-y-4">
          <SelectionHeader title="CANAPÉ SELECTIONS" />
          <div className="space-y-3">
            {Array.from({ length: parseInt(selectedCanapePackage) }).map((_, index) => (
              <div key={index}>
                {!selectedCanapes[index] ? (
                  <Select 
                    value={selectedCanapes[index] || ''} 
                    onValueChange={(value) => onCanapeSelection(index + 1, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select canapé ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {canapeOptions
                        .filter(option => !selectedCanapes.includes(option.value))
                        .map((canape) => (
                          <SelectItem 
                            key={canape.value} 
                            value={canape.value}
                          >
                            {canape.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <SelectionDisplay
                    label={canapeOptions.find(opt => opt.value === selectedCanapes[index])?.label || ''}
                    onRemove={() => onCanapeSelection(index + 1, '')}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CanapeSection;