
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PrintMenu } from '../menu/PrintMenu';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';
import PrintKitchenMenu from '../menu/kitchen/PrintKitchenMenu';

interface EventHeaderProps {
  eventCode: string;
  event: Event;
  menuState: MenuState | null;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  eventCode,
  event,
  menuState,
  isCustomMenu = false,
  onCustomMenuToggle
}) => {
  // Handler to ensure toggle changes are properly dispatched
  const handleToggleChange = (checked: boolean) => {
    if (onCustomMenuToggle) {
      onCustomMenuToggle(checked);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
      {onCustomMenuToggle && (
        <div className="flex items-center space-x-2">
          <Switch 
            id="custom-menu-toggle" 
            checked={isCustomMenu} 
            onCheckedChange={handleToggleChange}
          />
          <Label htmlFor="custom-menu-toggle">Custom Menu</Label>
        </div>
      )}
      
      {menuState && (
        <div className="flex space-x-2">
          <PrintMenu event={event} menuState={menuState} />
          <PrintKitchenMenu event={event} menuState={menuState} />
        </div>
      )}
    </div>
  );
};
