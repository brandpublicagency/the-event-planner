import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CustomMenuSectionProps {
  isCustomMenu: boolean;
  customMenuDetails: string;
  onCustomMenuToggle: (checked: boolean) => void;
  onCustomMenuDetailsChange: (details: string) => void;
}

const CustomMenuSection = ({
  isCustomMenu,
  customMenuDetails,
  onCustomMenuToggle,
  onCustomMenuDetailsChange,
}: CustomMenuSectionProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          checked={isCustomMenu}
          onCheckedChange={onCustomMenuToggle}
        />
        <span>Custom Menu</span>
      </div>

      {isCustomMenu && (
        <div className="print:break-inside-avoid">
          <Textarea
            className="w-full"
            placeholder="Enter custom menu details..."
            value={customMenuDetails}
            onChange={(e) => onCustomMenuDetailsChange(e.target.value)}
            rows={10}
          />
        </div>
      )}
    </>
  );
};

export default CustomMenuSection;