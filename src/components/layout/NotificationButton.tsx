
import React, { useState, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotifications } from "@/contexts/NotificationContext";
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
import { Badge } from "@/components/ui/badge";

export const NotificationButton = () => {
  const { unreadCount: generalUnreadCount, notifications: generalNotifications } = useNotifications();
  const { unreadCount: scheduledUnreadCount, notifications: scheduledNotifications } = useScheduledNotifications();
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Log notification counts and details for debugging
  console.log('General notifications:', generalNotifications.length, 'Unread:', generalUnreadCount);
  console.log('Scheduled notifications:', scheduledNotifications?.length, 'Unread:', scheduledUnreadCount);
  
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
          className="relative inline-flex items-center cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          <span className="text-base font-medium">Notifications</span>
          {totalUnreadCount > 0 && (
            <Badge 
              variant="notification" 
              className="ml-1 flex items-center justify-center"
            >
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={4}>
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
