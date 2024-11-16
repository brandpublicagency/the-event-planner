import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  mainCourseTypes, 
  buffetMeatOptions,
  buffetVegetableOptions,
  buffetStarchOptions,
  karooMeatOptions,
  karooStarchOptions,
  karooVegetableOptions,
  platedMainOptions,
  saladOptions
} from './MenuTypes';

interface MainCourseSectionProps {
  selectedMainCourse: string;
  buffetMeatSelections?: string[];
  buffetVegetableSelections?: string[];
  buffetStarchSelections?: string[];
  buffetSaladSelection?: string;
  karooMeatSelection?: string;
  karooStarchSelection?: string;
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
  onKarooStarchSelectionChange: (value: string) => void;
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
  karooStarchSelection = '',
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

  const handleOptionToggle = (
    currentSelections: string[],
    value: string,
    onChange: (value: string[]) => void,
    maxSelections: number
  ) => {
    if (currentSelections.includes(value)) {
      onChange(currentSelections.filter(item => item !== value));
    } else if (currentSelections.length < maxSelections) {
      onChange([...currentSelections, value]);
    }
  };

  return (
    <div className="space-y-6 print:break-inside-avoid">
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

      {selectedMainCourse === 'buffet' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>MEAT SELECTION - CHOOSE TWO OPTIONS</Label>
            <div className="grid gap-3">
              {buffetMeatOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={buffetMeatSelections.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleOptionToggle(buffetMeatSelections, option.value, onBuffetMeatSelectionsChange, 2)
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>VEGETABLES - CHOOSE TWO OPTIONS</Label>
            <div className="grid gap-3">
              {buffetVegetableOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={buffetVegetableSelections.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleOptionToggle(buffetVegetableSelections, option.value, onBuffetVegetableSelectionsChange, 2)
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>STARCH SELECTION - CHOOSE TWO OPTIONS</Label>
            <div className="grid gap-3">
              {buffetStarchOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={buffetStarchSelections.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleOptionToggle(buffetStarchSelections, option.value, onBuffetStarchSelectionsChange, 2)
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>CHOOSE ONE SALAD SERVED TO THE TABLE</Label>
            <Select value={buffetSaladSelection} onValueChange={onBuffetSaladSelectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a salad" />
              </SelectTrigger>
              <SelectContent>
                {saladOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {selectedMainCourse === 'karoo' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>MEAT SELECTION - CHOOSE ONE OPTION</Label>
            <Select value={karooMeatSelection} onValueChange={onKarooMeatSelectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select meat option" />
              </SelectTrigger>
              <SelectContent>
                {karooMeatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>STARCH SELECTION</Label>
            <Select value={karooStarchSelection} onValueChange={onKarooStarchSelectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select starch option" />
              </SelectTrigger>
              <SelectContent>
                {karooStarchOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>VEGETABLES - CHOOSE TWO OPTIONS</Label>
            <div className="grid gap-3">
              {karooVegetableOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={karooVegetableSelections.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleOptionToggle(karooVegetableSelections, option.value, onKarooVegetableSelectionsChange, 2)
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>CHOOSE ONE SALAD SERVED TO THE TABLE</Label>
            <Select value={karooSaladSelection} onValueChange={onKarooSaladSelectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a salad" />
              </SelectTrigger>
              <SelectContent>
                {saladOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {selectedMainCourse === 'plated' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>MAIN COURSE - CHOOSE ONE OPTION</Label>
            <Select value={platedMainSelection} onValueChange={onPlatedMainSelectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select main course" />
              </SelectTrigger>
              <SelectContent>
                {platedMainOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>CHOOSE ONE SALAD SERVED TO THE TABLE</Label>
            <Select value={platedSaladSelection} onValueChange={onPlatedSaladSelectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a salad" />
              </SelectTrigger>
              <SelectContent>
                {saladOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCourseSection;