import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

interface EventHeaderProps {
  eventCode: string;
  onPrint: () => void;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
}

export const EventHeader = ({ eventCode, onPrint, isCustomMenu, onCustomMenuToggle }: EventHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6 print:hidden">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 rounded-full bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Button>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-600">Custom Menu</span>
          <Switch
            checked={isCustomMenu}
            onCheckedChange={onCustomMenuToggle}
            className="border border-zinc-200 data-[state=unchecked]:border-zinc-200"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/events/${eventCode}/edit`)}
          className="flex items-center gap-2 rounded-full bg-white"
        >
          <Edit className="h-4 w-4" />
          Edit Details
        </Button>
        <Button 
          onClick={onPrint} 
          variant="outline" 
          size="sm"
          className="rounded-full bg-white"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};