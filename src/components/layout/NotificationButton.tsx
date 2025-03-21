
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
import { motion, AnimatePresence } from "framer-motion";

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
          <span className="relative inline-flex items-center px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">
            <span className="relative">
              <Bell className="h-5 w-5" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.div 
                    className="absolute -top-1 -right-1" 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
            <span className="ms-1.5 text-sm font-medium">Notifications</span>
            {unreadCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-1.5 bg-zinc-100 text-zinc-800 border border-zinc-200"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0" sideOffset={4}>
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
