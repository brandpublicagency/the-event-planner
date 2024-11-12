import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { canapePackages, canapeOptions } from './MenuTypes';

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
    <>
      <div className="print:break-inside-avoid">
        <Select value={selectedCanapePackage} onValueChange={onCanapePackageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select number of canapés" />
          </SelectTrigger>
          <SelectContent>
            {canapePackages.map((pkg) => (
              <SelectItem key={pkg.value} value={pkg.value}>
                <div className="flex justify-between items-center w-full">
                  <span>{pkg.label}</span>
                  <span className="text-sm text-zinc-500">R {pkg.price}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCanapePackage && (
        <div className="space-y-4 print:break-inside-avoid">
          {Array.from({ length: parseInt(selectedCanapePackage) }).map((_, index) => (
            <div key={index} className="print:break-inside-avoid">
              <Select 
                value={selectedCanapes[index] || ''} 
                onValueChange={(value) => onCanapeSelection(index + 1, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select canapé ${index + 1}`} />
                </SelectTrigger>
                <SelectContent>
                  {canapeOptions.map((canape) => (
                    <SelectItem 
                      key={canape.value} 
                      value={canape.value}
                      disabled={selectedCanapes.includes(canape.value)}
                    >
                      {canape.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CanapeSection;