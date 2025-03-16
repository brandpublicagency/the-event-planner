
import React, { useState, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export const NotificationButton = () => {
  const { unreadCount, notifications, refreshNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [prevUnreadCount, setPrevUnreadCount] = useState(unreadCount);
  
  // Log notification counts for debugging
  console.log('NotificationButton rendering with notifications:', notifications.length, 'Unread:', unreadCount);
  
  // Add animation effect when new notifications arrive
  useEffect(() => {
    if (unreadCount > prevUnreadCount) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevUnreadCount(unreadCount);
  }, [unreadCount, prevUnreadCount]);

  // Refresh notifications when dropdown is opened
  useEffect(() => {
    if (open) {
      refreshNotifications().catch(err => {
        console.error('Failed to refresh notifications when opening dropdown:', err);
      });
    }
  }, [open, refreshNotifications]);

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
          <span className="relative inline-flex items-center">
            <Bell className={`h-5 w-5 ${animate ? 'animate-bounce' : ''}`} />
            <span className="ms-1.5 text-base font-medium">Notifications</span>
            {unreadCount > 0 && (
              <Badge 
                variant="notification" 
                className="ml-1 flex items-center justify-center"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={4}>
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
