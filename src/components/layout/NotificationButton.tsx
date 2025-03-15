
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotifications } from "@/contexts/NotificationContext";
import { Bell } from "lucide-react";

export const NotificationButton = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
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
          <Bell className="h-4 w-4 text-zinc-700" />
          <span className="text-sm font-medium text-zinc-700 hidden sm:inline-block">Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs font-medium bg-red-500 text-white px-1 py-0.5 rounded-full min-w-[18px] h-[18px] inline-flex justify-center items-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={4}>
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
