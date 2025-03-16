
import React, { useState, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotifications } from "@/contexts/NotificationContext";
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
import { Bell } from "lucide-react";

export const NotificationButton = () => {
  const { unreadCount: generalUnreadCount } = useNotifications();
  const { unreadCount: scheduledUnreadCount } = useScheduledNotifications();
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Combined unread count
  const totalUnreadCount = generalUnreadCount + scheduledUnreadCount;
  
  // Add animation effect when new notifications arrive
  useEffect(() => {
    if (totalUnreadCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [totalUnreadCount]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div 
          className={`flex items-center gap-2 cursor-pointer relative ${animate ? 'animate-pulse' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          <Bell className="h-5 w-5 text-zinc-700" />
          <span className="text-sm font-medium">Notifications</span>
          {totalUnreadCount > 0 && (
            <span className="flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-[4px] w-5 h-5 min-w-[20px]">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={4}>
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
