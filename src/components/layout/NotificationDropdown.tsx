
import React, { useCallback, useEffect } from 'react';
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ExternalLink, Check } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from 'react-router-dom';
import { NotificationsList } from "@/components/notifications/NotificationList";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function NotificationDropdown() {
  const { 
    notifications, 
    markAsRead, 
    markAsCompleted,
    markAllAsRead,
    refreshNotifications,
    loading,
    error
  } = useNotifications();
  
  const navigate = useNavigate();

  // Only refresh when dropdown is opened
  useEffect(() => {
    refreshNotifications().catch(err => {
      console.error("Error refreshing notifications in dropdown:", err);
    });
  }, [refreshNotifications]);

  // Use a limited number of notifications to prevent performance issues
  const limitedNotifications = notifications.slice(0, 5);

  // Handle viewing a notification
  const handleViewNotification = useCallback(async (id: string, relatedId?: string) => {
    try {
      // Mark as read
      await markAsRead(id);
      
      // Navigate based on the notification type
      if (relatedId) {
        if (relatedId.startsWith('EVENT-')) {
          navigate(`/events/${relatedId}`);
        } else if (relatedId.startsWith('task_')) {
          navigate(`/tasks?selected=${relatedId}`);
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

  // Handle marking all as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      toast("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast("Failed to mark all as read");
    }
  }, [markAllAsRead]);

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
        <div className="flex gap-2">
          <Button
            onClick={handleMarkAllAsRead}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            disabled={!notifications.some(n => !n.read) || loading}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[350px] w-full">
        {loading ? (
          <div className="p-4 text-center flex flex-col items-center justify-center">
            <Spinner className="h-4 w-4 mb-2 text-primary" />
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-sm text-red-500">Failed to load notifications</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => refreshNotifications()}
            >
              Try again
            </Button>
          </div>
        ) : limitedNotifications.length > 0 ? (
          <NotificationsList
            notifications={limitedNotifications}
            onViewDetail={handleViewNotification}
            onCompleteTask={handleCompleteTask}
          />
        ) : (
          <div className="p-4 text-center">
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
