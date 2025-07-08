import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Event } from '@/types/event';

interface EventHeaderProps {
  eventCode: string;
  event: Event;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  eventCode,
  event
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
      <div className="text-sm text-gray-600">
        Event Code: {eventCode}
      </div>
    </div>
  );
};