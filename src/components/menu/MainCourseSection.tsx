import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mainCourseTypes } from './MenuTypes';
import BuffetSection from './BuffetSection';
import KarooSection from './KarooSection';
import PlatedSection from './PlatedSection';

interface MainCourseSectionProps {
  selectedMainCourse: string;
  buffetMeatSelections?: string[];
  buffetVegetableSelections?: string[];
  buffetStarchSelections?: string[];
  buffetSaladSelection?: string;
  karooMeatSelection?: string;
  karooStarchSelection: string[];  // Changed from string to string[]
  karooVegetableSelections?: string[];
  karooSaladSelection?: string;
  platedMainSelection?: string;
  platedSaladSelection?: string;
  onMainCourseChange: (value: string) => void;
  onBuffetMeatSelectionsChange: (value: string[]) => void;
  onBuffetVegetableSelectionsChange: (value: string[]) => void;
  onBuffetStarchSelectionsChange: (value: string[]) => void;
  onBuffetSaladSelectionChange: (value: string) => void;
  onKarooMeatSelectionChange: (value: string) => void;
  onKarooStarchSelectionChange: (value: string[]) => void;  // Changed from (value: string) to (value: string[])
  onKarooVegetableSelectionsChange: (value: string[]) => void;
  onKarooSaladSelectionChange: (value: string) => void;
  onPlatedMainSelectionChange: (value: string) => void;
  onPlatedSaladSelectionChange: (value: string) => void;
}

const MainCourseSection = ({
  selectedMainCourse,
  buffetMeatSelections = [],
  buffetVegetableSelections = [],
  buffetStarchSelections = [],
  buffetSaladSelection = '',
  karooMeatSelection = '',
  karooStarchSelection = [],  // Changed default from '' to []
  karooVegetableSelections = [],
  karooSaladSelection = '',
  platedMainSelection = '',
  platedSaladSelection = '',
  onMainCourseChange,
  onBuffetMeatSelectionsChange,
  onBuffetVegetableSelectionsChange,
  onBuffetStarchSelectionsChange,
  onBuffetSaladSelectionChange,
  onKarooMeatSelectionChange,
  onKarooStarchSelectionChange,
  onKarooVegetableSelectionsChange,
  onKarooSaladSelectionChange,
  onPlatedMainSelectionChange,
  onPlatedSaladSelectionChange,
}: MainCourseSectionProps) => {
  const selectedType = mainCourseTypes.find(type => type.value === selectedMainCourse);

  return (
    <div className="space-y-6 print:break-inside-avoid">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-zinc-500">MENU TYPE</h4>
        {!selectedMainCourse ? (
          <Select value={selectedMainCourse} onValueChange={onMainCourseChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select main course option" />
            </SelectTrigger>
            <SelectContent>
              {mainCourseTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} - R {option.price.toFixed(2)} per person
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex justify-between items-center">
            <span>{selectedType?.label} - R {selectedType?.price.toFixed(2)} per person</span>
            <button
              onClick={() => onMainCourseChange('')}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {selectedMainCourse === 'buffet' && (
        <BuffetSection
          buffetMeatSelections={buffetMeatSelections}
          buffetVegetableSelections={buffetVegetableSelections}
          buffetStarchSelections={buffetStarchSelections}
          buffetSaladSelection={buffetSaladSelection}
          onBuffetMeatSelectionsChange={onBuffetMeatSelectionsChange}
          onBuffetVegetableSelectionsChange={onBuffetVegetableSelectionsChange}
          onBuffetStarchSelectionsChange={onBuffetStarchSelectionsChange}
          onBuffetSaladSelectionChange={onBuffetSaladSelectionChange}
        />
      )}

      {selectedMainCourse === 'karoo' && (
        <KarooSection
          karooMeatSelection={karooMeatSelection}
          karooStarchSelection={karooStarchSelection}
          karooVegetableSelections={karooVegetableSelections}
          karooSaladSelection={karooSaladSelection}
          onKarooMeatSelectionChange={onKarooMeatSelectionChange}
          onKarooStarchSelectionChange={onKarooStarchSelectionChange}
          onKarooVegetableSelectionsChange={onKarooVegetableSelectionsChange}
          onKarooSaladSelectionChange={onKarooSaladSelectionChange}
        />
      )}

      {selectedMainCourse === 'plated' && (
        <PlatedSection
          platedMainSelection={platedMainSelection}
          platedSaladSelection={platedSaladSelection}
          onPlatedMainSelectionChange={onPlatedMainSelectionChange}
          onPlatedSaladSelectionChange={onPlatedSaladSelectionChange}
        />
      )}
    </div>
  );
};

export default MainCourseSection;