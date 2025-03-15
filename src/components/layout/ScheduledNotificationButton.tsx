
import React from 'react';
import { Button } from "@/components/ui/button";
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
import { AlarmClock } from "lucide-react";
import { ScheduledNotificationDropdown } from './ScheduledNotificationDropdown';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ScheduledNotificationButton() {
  const { unreadCount } = useScheduledNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <AlarmClock className="h-4 w-4 text-zinc-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs font-medium bg-red-500 text-white px-1 py-0.5 rounded-full min-w-[18px] h-[18px] inline-flex justify-center items-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <ScheduledNotificationDropdown />
      </PopoverContent>
    </Popover>
  );
}
