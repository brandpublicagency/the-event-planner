
import React, { useCallback, useEffect, useState } from 'react';
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ExternalLink, Check, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from 'react-router-dom';
import { NotificationsList } from "@/components/notifications/NotificationList";
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dropdownInitialized, setDropdownInitialized] = useState(false);

  // Refresh when dropdown is opened, with debounce
  useEffect(() => {
    if (!dropdownInitialized) {
      setDropdownInitialized(true);
      console.log("Initializing notification dropdown");
      refreshNotifications().catch(err => {
        console.error("Error refreshing notifications in dropdown:", err);
      });
    }
  }, [refreshNotifications, dropdownInitialized]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshNotifications()
      .catch(err => {
        console.error("Error refreshing notifications:", err);
      })
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
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
      
      toast({
        title: "Notification",
        description: "Marked as read",
        variant: "success"
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  }, [markAsRead, navigate]);

  // Handle completing a task
  const handleCompleteTask = useCallback(async (id: string) => {
    try {
      await markAsCompleted(id);
      toast({
        title: "Success",
        description: "Task marked as complete!",
        variant: "success"
      });
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark task as complete",
        variant: "destructive"
      });
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
      toast({
        title: "Success",
        description: "All notifications marked as read",
        variant: "success"
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive"
      });
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
            disabled={!notifications.some(n => !n.read) || loading || isRefreshing}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={loading || isRefreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[350px] w-full">
        {(loading && notifications.length === 0) || isRefreshing ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-sm text-red-500 mb-2">Failed to load notifications</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Try again</span>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
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
