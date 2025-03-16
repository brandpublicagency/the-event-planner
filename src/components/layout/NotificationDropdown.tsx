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
  PackageCheck,
  MessageSquare,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// Import the component with the correct name
import { NotificationsList } from "@/components/notifications/NotificationList";

interface NotificationItemProps {
  notification: Notification;
  onView: (notification: Notification, e: React.MouseEvent) => void;
  onComplete: (notification: Notification, e: React.MouseEvent) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onView,
  onComplete
}) => {
  return (
    <DropdownMenuItem
      onClick={(e) => onView(notification, e)}
      className="w-full"
    >
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-1 text-left">
          <p className="text-sm font-medium leading-none">{notification.title}</p>
          <p className="text-sm text-muted-foreground">
            {notification.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </DropdownMenuItem>
  );
};

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

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
      router.push(`/events/${notification.relatedId}`);
    } else if (notification.type === "task_overdue" || notification.type === "task_upcoming") {
      router.push(`/tasks`);
    } else {
      router.push(`/`);
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
    router.push(`/tasks`);
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 rounded-full px-1 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" ref={dropdownRef}>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">Notifications</p>
          <p className="text-sm text-muted-foreground">
            You have {notifications.length} notifications.
          </p>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px] w-full">
          {/* {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onView={handleViewNotification}
              onComplete={handleMarkAsComplete}
            />
          ))} */}
          {/* When rendering the NotificationsList, make sure to use the updated prop names
          and pass functions that match the expected signatures: */}

          <NotificationsList
            notifications={notifications}
            onViewDetail={(id, relatedId) => {
              // Handle the view detail action with id and relatedId
              const notification = notifications.find(n => n.id === id);
              if (notification) {
                handleViewNotification(notification, new MouseEvent('click') as any);
              }
            }}
            onCompleteTask={(id) => {
              // Handle the complete task action with id
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
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
