
import React, { useState, useRef, useEffect } from 'react';
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CheckCheck, ExternalLink } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Notification } from '@/types/notification';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { NotificationsList } from "@/components/notifications/NotificationList";

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleViewNotification = async (id: string, relatedId?: string) => {
    try {
      await markAsRead(id);
      toast.success(`Notification marked as read!`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read.");
    }

    setIsOpen(false);

    // Find the notification to determine where to navigate
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      if (notification.type === "event_created" && relatedId) {
        navigate(`/events/${relatedId}`);
      } else if (notification.type === "task_overdue" || notification.type === "task_upcoming") {
        navigate(`/tasks`);
      } else {
        navigate(`/`);
      }
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success(`Task marked as complete!`);
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

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-1 p-2">
        <p className="text-sm font-medium leading-none">Notifications</p>
        <p className="text-sm text-muted-foreground">
          You have {notifications.length} notifications.
        </p>
      </div>
      <DropdownMenuSeparator />
      <ScrollArea className="h-[400px] w-full">
        <NotificationsList
          notifications={notifications}
          onViewDetail={handleViewNotification}
          onCompleteTask={handleCompleteTask}
        />
      </ScrollArea>
      <DropdownMenuSeparator />
      <div
        onClick={handleViewAll}
        className="w-full flex items-center gap-2 p-2 hover:bg-zinc-100 cursor-pointer"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="text-sm">View all notifications</span>
      </div>
    </div>
  );
}
