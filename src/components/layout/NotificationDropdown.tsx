
import React, { useState, useRef, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { NotificationsList } from "@/components/notifications/NotificationList";

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleViewNotification = async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await markAsRead(notification.id);
      toast.success(`Notification "${notification.title}" marked as read!`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read.");
    }

    setIsOpen(false);

    // Redirect user based on notification type
    if (notification.type === "event_created") {
      navigate(`/events/${notification.relatedId}`);
    } else if (notification.type === "task_overdue" || notification.type === "task_upcoming") {
      navigate(`/tasks`);
    } else {
      navigate(`/`);
    }
  };

  const handleMarkAsComplete = async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await markAsRead(notification.id);
      toast.success(`Task "${notification.title}" marked as complete!`);
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast.error("Failed to mark task as complete.");
    }

    setIsOpen(false);
    navigate(`/tasks`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-1 p-2">
        <p className="text-sm font-medium leading-none">Notifications</p>
        <p className="text-sm text-muted-foreground">
          You have {notifications.length} notifications.
        </p>
      </div>
      <DropdownMenuSeparator />
      <ScrollArea className="h-[300px] w-full">
        <NotificationsList
          notifications={notifications}
          onViewDetail={(id, relatedId) => {
            const notification = notifications.find(n => n.id === id);
            if (notification) {
              handleViewNotification(notification, new MouseEvent('click') as any);
            }
          }}
          onCompleteTask={(id) => {
            const notification = notifications.find(n => n.id === id);
            if (notification) {
              handleMarkAsComplete(notification, new MouseEvent('click') as any);
            }
          }}
        />
      </ScrollArea>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          markAllAsRead();
          setIsOpen(false);
          toast.success("All notifications marked as read!");
        }}
        className="w-full cursor-pointer"
      >
        <CheckCheck className="mr-2 h-4 w-4" />
        Mark all as read
      </DropdownMenuItem>
    </div>
  );
}
