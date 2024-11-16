import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { karooMeatOptions, karooStarchGroups, saladOptions } from './MenuTypes';
import SelectionHeader from './SelectionHeader';
import SelectionDisplay from './SelectionDisplay';
import KarooStarchGroup from './karoo/KarooStarchGroup';
import KarooVegetableSelect from './karoo/KarooVegetableSelect';

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
        <KarooStarchGroup
          title="POTATO OPTION"
          options={karooStarchGroups.potatoes}
          value={potatoSelection}
          onChange={handlePotatoSelectionChange}
        />

        <KarooStarchGroup
          title="RICE OPTION"
          options={karooStarchGroups.rice}
          value={riceSelection}
          onChange={handleRiceSelectionChange}
        />
      </div>

      <KarooVegetableSelect
        selections={karooVegetableSelections}
        onSelectionsChange={onKarooVegetableSelectionsChange}
      />

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