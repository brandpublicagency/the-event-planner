
import React, { useState, useRef, useCallback } from 'react';
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ExternalLink } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from 'react-router-dom';
import { NotificationsList } from "@/components/notifications/NotificationList";
import { toast } from 'sonner';
import { Notification } from '@/types/notification';

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAsCompleted } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Log notifications for debugging
  console.log('NotificationDropdown rendering with notifications:', notifications.length, 'Unread:', unreadCount);

  // Handler for viewing a notification
  const handleViewNotification = useCallback(async (id: string, relatedId?: string) => {
    try {
      await markAsRead(id);
      
      // Close dropdown
      setIsOpen(false);

      // Find the notification to determine navigation
      const notification = notifications.find(n => n.id === id);
      if (notification) {
        if (relatedId) {
          // Handle different types of related IDs
          if (relatedId.startsWith('event_')) {
            navigate(`/events/${relatedId}`);
          } else if (relatedId.startsWith('task_')) {
            navigate(`/tasks?selected=${relatedId}`);
          } else if (relatedId.startsWith('doc_')) {
            navigate(`/documents?document=${relatedId.replace('doc_', '')}`);
          } else {
            navigate(`/${relatedId}`);
          }
        } else {
          // Default navigation based on notification type
          if (notification.type === "task_overdue" || notification.type === "task_upcoming") {
            navigate(`/tasks`);
          } else if (notification.type === "document_due_reminder") {
            navigate(`/documents`);
          } else if (notification.type === "final_payment_reminder") {
            navigate(`/events`);
          } else {
            navigate(`/`);
          }
        }
      }

      toast.success(`Notification marked as read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  }, [markAsRead, navigate, notifications]);

  // Handler for completing a task
  const handleCompleteTask = useCallback(async (id: string) => {
    try {
      await markAsCompleted(id);
      toast.success(`Task marked as complete!`);
      
      // Close dropdown and navigate to tasks
      setIsOpen(false);
      navigate(`/tasks`);
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast.error("Failed to mark task as complete");
    }
  }, [markAsCompleted, navigate]);

  const handleViewAll = useCallback(() => {
    setIsOpen(false);
    navigate('/notifications');
  }, [navigate]);

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
