
import React, { useState, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";

export const NotificationButton = () => {
  const { unreadCount: generalUnreadCount, notifications: generalNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Log notification counts for debugging
  console.log('NotificationButton rendering with notifications:', generalNotifications.length, 'Unread:', generalUnreadCount);
  
  // Total unread count
  const totalUnreadCount = generalUnreadCount;
  
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
