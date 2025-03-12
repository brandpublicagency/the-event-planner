
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Event } from "@/types/event";
import { MenuState } from '@/hooks/menuStateTypes';
import { PrintKitchenMenu } from '@/components/menu/PrintKitchenMenu';

interface EventHeaderProps {
  eventCode: string;
  event?: Event;
  menuState?: MenuState;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
}

export const EventHeader = ({
  eventCode,
  event,
  menuState,
  isCustomMenu,
  onCustomMenuToggle
}: EventHeaderProps) => {
  const navigate = useNavigate();
  
  return <div className="flex items-center justify-between print:hidden print:bg-white px-0 py-0">
      <Button variant="outline" size="sm" onClick={() => navigate('/events')} className="flex items-center gap-2 rounded-full">
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Button>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-600">Custom Menu</span>
          <Switch checked={isCustomMenu} onCheckedChange={onCustomMenuToggle} className="border border-zinc-200 data-[state=unchecked]:border-zinc-200" />
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(`/events/${eventCode}/edit`)} className="flex items-center gap-2 rounded-full">
          <Edit className="h-4 w-4" />
          Edit Details
        </Button>
        {event && menuState && (
          <PrintKitchenMenu event={event} menuState={menuState} />
        )}
      </div>
    </div>;
};
