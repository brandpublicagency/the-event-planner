import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { karooMeatOptions, karooStarchGroups, karooVegetableOptions, saladOptions } from './MenuTypes';

interface KarooSectionProps {
  karooMeatSelection: string;
  karooStarchSelection: string;
  karooVegetableSelections: string[];
  karooSaladSelection: string;
  onKarooMeatSelectionChange: (value: string) => void;
  onKarooStarchSelectionChange: (value: string) => void;
  onKarooVegetableSelectionsChange: (value: string[]) => void;
  onKarooSaladSelectionChange: (value: string) => void;
}

const KarooStarchSelection = ({
  potatoSelection,
  riceSelection,
  onPotatoSelectionChange,
  onRiceSelectionChange
}: {
  potatoSelection: string;
  riceSelection: string;
  onPotatoSelectionChange: (value: string) => void;
  onRiceSelectionChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>POTATO OPTION - SELECT ONE</Label>
        <RadioGroup value={potatoSelection} onValueChange={onPotatoSelectionChange}>
          <div className="grid gap-3">
            {karooStarchGroups.potatoes.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={"potato-" + option.value} />
                <Label htmlFor={"potato-" + option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>RICE OPTION - SELECT ONE</Label>
        <RadioGroup value={riceSelection} onValueChange={onRiceSelectionChange}>
          <div className="grid gap-3">
            {karooStarchGroups.rice.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={"rice-" + option.value} />
                <Label htmlFor={"rice-" + option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

const KarooSection = ({
  karooMeatSelection,
  karooStarchSelection,
  karooVegetableSelections,
  karooSaladSelection,
  onKarooMeatSelectionChange,
  onKarooStarchSelectionChange,
  onKarooVegetableSelectionsChange,
  onKarooSaladSelectionChange,
}: KarooSectionProps) => {
  const [potatoSelection, setPotatoSelection] = React.useState('');
  const [riceSelection, setRiceSelection] = React.useState('');

  React.useEffect(() => {
    if (karooStarchSelection) {
      const [potato, rice] = karooStarchSelection.split(',');
      setPotatoSelection(potato || '');
      setRiceSelection(rice || '');
    }
  }, [karooStarchSelection]);

  const handlePotatoSelectionChange = (value: string) => {
    const newSelection = [value, riceSelection].filter(Boolean).join(',');
    onKarooStarchSelectionChange(newSelection);
    setPotatoSelection(value);
  };

  const handleRiceSelectionChange = (value: string) => {
    const newSelection = [potatoSelection, value].filter(Boolean).join(',');
    onKarooStarchSelectionChange(newSelection);
    setRiceSelection(value);
  };

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

      <KarooStarchSelection
        potatoSelection={potatoSelection}
        riceSelection={riceSelection}
        onPotatoSelectionChange={handlePotatoSelectionChange}
        onRiceSelectionChange={handleRiceSelectionChange}
      />

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
                onCheckedChange={() => 
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
  );
};

export default KarooSection;