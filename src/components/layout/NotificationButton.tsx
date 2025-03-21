
import React, { useState } from "react";
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
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

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
            <Bell className="h-5 w-5" />
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
