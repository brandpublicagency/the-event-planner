
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
import { Badge } from "@/components/ui/badge";

export function ScheduledNotificationButton() {
  const { unreadCount } = useScheduledNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <AlarmClock className="h-4 w-4 text-zinc-700" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-[16px] text-[10px] font-medium px-[5px] bg-zinc-900 text-white"
              variant="default"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <ScheduledNotificationDropdown />
      </PopoverContent>
    </Popover>
  );
}
