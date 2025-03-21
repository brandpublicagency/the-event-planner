
import React from 'react';
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ExternalLink } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from 'react-router-dom';
import { NotificationsList } from "@/components/notifications/NotificationList";
import { toast } from 'sonner';

export function NotificationDropdown() {
  const { notifications, markAsRead, markAsCompleted } = useNotifications();
  const navigate = useNavigate();

  // Handler for viewing a notification
  const handleViewNotification = async (id: string, relatedId?: string) => {
    try {
      // Mark as read
      await markAsRead(id);
      
      // Navigate based on the notification type
      if (relatedId) {
        if (relatedId.startsWith('event_')) {
          navigate(`/events/${relatedId}`);
        } else if (relatedId.startsWith('task_')) {
          navigate(`/tasks?selected=${relatedId}`);
        } else {
          navigate(`/${relatedId}`);
        }
      } else {
        navigate(`/`);
      }
      
      toast.success(`Notification marked as read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  // Handler for completing a task
  const handleCompleteTask = async (id: string) => {
    try {
      await markAsCompleted(id);
      toast.success(`Task marked as complete!`);
      navigate(`/tasks`);
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast.error("Failed to mark task as complete");
    }
  };

  const handleViewAll = () => {
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
      <button
        onClick={handleViewAll}
        className="w-full flex items-center gap-2 p-2 hover:bg-zinc-100 cursor-pointer"
        type="button"
        aria-label="View all notifications"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="text-sm">View all notifications</span>
      </button>
    </div>
  );
}
