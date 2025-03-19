
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PrintMenu } from '../menu/PrintMenu';
import { Event } from '@/types/event';
import { MenuState } from '@/hooks/menuStateTypes';

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
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">{event.name || 'Untitled Event'}</h1>
          <p className="text-sm text-muted-foreground">{eventCode}</p>
        </div>
        
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
            <PrintMenu event={event} menuState={menuState} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
