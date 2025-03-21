
import React, { useState, useCallback } from 'react';
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from 'react-router-dom';
import { NotificationsList } from "@/components/notifications/NotificationList";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

export function NotificationDropdown() {
  const { notifications, markAsRead, markAsCompleted } = useNotifications();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use a limited number of notifications to prevent performance issues
  const limitedNotifications = notifications.slice(0, 15);

  // Handle viewing a notification
  const handleViewNotification = useCallback(async (id: string, relatedId?: string) => {
    try {
      // Mark as read
      await markAsRead(id);
      
      // Navigate based on the notification type
      if (relatedId) {
        if (relatedId.startsWith('event_')) {
          navigate(`/events/${relatedId}`);
        } else {
          navigate(`/${relatedId}`);
        }
      }
      
      toast("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast("Failed to mark notification as read");
    }
  }, [markAsRead, navigate]);

  // Handle completing a task
  const handleCompleteTask = useCallback(async (id: string) => {
    try {
      await markAsCompleted(id);
      toast("Task marked as complete!");
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast("Failed to mark task as complete");
    }
  }, [markAsCompleted]);

  // Handle viewing all notifications
  const handleViewAll = useCallback(() => {
    navigate('/notifications');
  }, [navigate]);

  return (
    <div className="w-full min-w-[320px]">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-zinc-900">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {notifications.filter(n => !n.read).length > 0 
              ? `You have ${notifications.filter(n => !n.read).length} unread notifications`
              : 'All caught up!'}
          </p>
        </div>
      </div>
      
      <ScrollArea className="h-[350px] w-full">
        {limitedNotifications.length > 0 ? (
          <NotificationsList
            notifications={limitedNotifications}
            onViewDetail={handleViewNotification}
            onCompleteTask={handleCompleteTask}
            listType="default"
          />
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-zinc-500">No notifications to display</p>
          </div>
        )}
      </ScrollArea>
      
      <DropdownMenuSeparator />
      <div className="p-2">
        <Button
          onClick={handleViewAll}
          className="w-full flex items-center gap-2 justify-center"
          variant="secondary"
          size="sm"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="text-xs">View all notifications</span>
        </Button>
      </div>
    </div>
  );
}
