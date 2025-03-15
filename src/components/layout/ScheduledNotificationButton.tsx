
import React from 'react';
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
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
        <div className="flex items-center gap-2 cursor-pointer relative">
          <span className="text-sm font-medium">Scheduled</span>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center bg-amber-500 text-white text-xs font-medium rounded-full w-6 h-6 min-w-[24px]">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <ScheduledNotificationDropdown />
      </PopoverContent>
    </Popover>
  );
}
