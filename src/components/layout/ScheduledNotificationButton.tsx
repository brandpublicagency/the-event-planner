
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScheduledNotificationDropdown } from "./ScheduledNotificationDropdown";
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
import { AlarmClock } from "lucide-react";

export const ScheduledNotificationButton = () => {
  const { unreadCount, triggerNotificationProcessing } = useScheduledNotifications();
  const [open, setOpen] = useState(false);

  const handleTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerNotificationProcessing();
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative rounded-md px-2 h-8 flex items-center justify-center gap-1 hover:bg-zinc-100"
            onClick={(e) => {
              // Prevent default to avoid navigation
              e.preventDefault();
              setOpen(!open);
            }}
          >
            <AlarmClock className="h-4 w-4 text-zinc-700" />
            <span className="text-sm font-medium text-zinc-700">Reminders</span>
            {unreadCount > 0 && (
              <span className="text-xs font-medium bg-blue-500 text-white px-1.5 py-0.5 rounded-md min-w-[20px] inline-flex justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            <span className="sr-only">Scheduled Reminders</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96 p-0" sideOffset={4}>
          <ScheduledNotificationDropdown />
        </DropdownMenuContent>
      </DropdownMenu>
      
      {process.env.NODE_ENV === 'development' && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-md border-dashed border-zinc-300 text-xs text-zinc-500"
          onClick={handleTrigger}
        >
          Check Reminders
        </Button>
      )}
    </div>
  );
};
