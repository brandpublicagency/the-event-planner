import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface KarooStarchGroupProps {
  title: string;
  options: { value: string; label: string; }[];
  value: string;
  onChange: (value: string) => void;
}

const KarooStarchGroup = ({ title, options, value, onChange }: KarooStarchGroupProps) => {
  return (
    <div className="space-y-4">
      <div className="text-zinc-600 mb-2">{title}</div>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid gap-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3 hover:bg-zinc-50 p-2 rounded-md transition-colors">
              <RadioGroupItem value={option.value} id={`${title}-${option.value}`} />
              <Label htmlFor={`${title}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default KarooStarchGroup;