import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface CustomMenuSectionProps {
  customMenuDetails: string;
  onCustomMenuDetailsChange: (details: string) => void;
}

const CustomMenuSection = ({
  customMenuDetails,
  onCustomMenuDetailsChange,
}: CustomMenuSectionProps) => {
  return (
    <div className="print:break-inside-avoid">
      <Textarea
        className="w-full"
        placeholder="Enter custom menu details..."
        value={customMenuDetails}
        onChange={(e) => onCustomMenuDetailsChange(e.target.value)}
        rows={10}
      />
    </div>
  );
};

export default CustomMenuSection;