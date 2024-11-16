import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { karooMeatOptions, karooStarchGroups, karooVegetableOptions, saladOptions } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
import SelectionDisplay from './SelectionDisplay';

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SelectionHeader title="MEAT SELECTION" />
        {!karooMeatSelection ? (
          <Select value={karooMeatSelection} onValueChange={onKarooMeatSelectionChange}>
            <SelectTrigger>
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
        ) : (
          <SelectionDisplay
            label={karooMeatOptions.find(opt => opt.value === karooMeatSelection)?.label || ''}
            onRemove={() => onKarooMeatSelectionChange('')}
          />
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>POTATO OPTION</Label>
          <RadioGroup value={potatoSelection} onValueChange={handlePotatoSelectionChange}>
            <div className="grid gap-3">
              {karooStarchGroups.potatoes.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`potato-${option.value}`} />
                  <Label htmlFor={`potato-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>RICE OPTION</Label>
          <RadioGroup value={riceSelection} onValueChange={handleRiceSelectionChange}>
            <div className="grid gap-3">
              {karooStarchGroups.rice.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`rice-${option.value}`} />
                  <Label htmlFor={`rice-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-4">
        <SelectionHeader title="VEGETABLES" />
        <div className="grid gap-3">
          {karooVegetableOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-md transition-colors"
            >
              <Checkbox
                checked={karooVegetableSelections.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    if (karooVegetableSelections.length < 2) {
                      onKarooVegetableSelectionsChange([...karooVegetableSelections, option.value]);
                    }
                  } else {
                    onKarooVegetableSelectionsChange(
                      karooVegetableSelections.filter(item => item !== option.value)
                    );
                  }
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <SelectionHeader title="TABLE SALAD" />
        {!karooSaladSelection ? (
          <Select value={karooSaladSelection} onValueChange={onKarooSaladSelectionChange}>
            <SelectTrigger>
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
        ) : (
          <SelectionDisplay
            label={saladOptions.find(opt => opt.value === karooSaladSelection)?.label || ''}
            onRemove={() => onKarooSaladSelectionChange('')}
          />
        )}
      </div>
    </div>
  );
};

export default KarooSection;