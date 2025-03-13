
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotifications } from "@/contexts/NotificationContext";

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
          <span className="text-sm font-medium text-zinc-700">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs font-medium bg-red-500 text-white px-1.5 py-0.5 rounded-md min-w-[20px] inline-flex justify-center">
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
