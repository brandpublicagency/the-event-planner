
import React, { useCallback, useEffect, useState } from 'react';
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { RefreshCw, ExternalLink } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from 'react-router-dom';
import { NotificationsList } from "@/components/notifications/NotificationList";
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/types/notification";

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

  useEffect(() => {
    if (!dropdownInitialized) {
      setDropdownInitialized(true);
      console.log("Initializing notification dropdown");
      refreshNotifications().catch(err => {
        console.error("Error refreshing notifications in dropdown:", err);
      });
    }
  }, [refreshNotifications, dropdownInitialized]);

  const handleRefresh = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsRefreshing(true);
    refreshNotifications()
      .catch(err => {
        console.error("Error refreshing notifications:", err);
      })
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
  }, [refreshNotifications]);

  const limitedNotifications = notifications.slice(0, 5);

  const handleViewNotification = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAsRead(notification.id);
      
      if (notification.relatedId) {
        // Normalize event IDs across different formats
        if (notification.relatedId.match(/^\d+-\d+$/) || notification.relatedId.startsWith('EVENT-') || notification.relatedId.startsWith('event_')) {
          // Extract the event code, removing any prefixes
          const eventCode = notification.relatedId.startsWith('EVENT-') 
            ? notification.relatedId.replace('EVENT-', '') 
            : notification.relatedId.startsWith('event_') 
              ? notification.relatedId.replace('event_', '') 
              : notification.relatedId;
              
          console.log(`Notification dropdown: navigating to event: ${eventCode}`);
          navigate(`/events/${eventCode}`);
        } else if (notification.relatedId.startsWith('task_')) {
          navigate(`/tasks?selected=${notification.relatedId}`);
        } else {
          // For any other type of notification
          navigate(`/${notification.relatedId}`);
        }
      }
      
      toast({
        title: "Notification marked as read"
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  }, [markAsRead, navigate]);

  const handleCompleteTask = useCallback(async (notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAsCompleted(notification.id);
      toast({
        title: "Task marked as complete!"
      });
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast({
        title: "Failed to mark task as complete",
        variant: "destructive"
      });
    }
  }, [markAsCompleted]);

  const handleViewAll = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/notifications');
  }, [navigate]);

  const handleMarkAllAsRead = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await markAllAsRead();
      toast({
        title: "All notifications marked as read"
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "Failed to mark all as read",
        variant: "destructive"
      });
    }
  }, [markAllAsRead]);

  return (
    <div className="w-full min-w-[320px] bg-white">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-zinc-900">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {notifications.filter(n => !n.read).length > 0 
              ? `You have ${notifications.filter(n => !n.read).length} unread notifications`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button
            onClick={handleMarkAllAsRead}
            variant="default"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={!notifications.some(n => !n.read) || loading || isRefreshing}
          >
            Mark all read
          </Button>
          <Button
            onClick={handleRefresh}
            variant="default"
            size="sm"
            className="h-7 w-7 p-0"
            disabled={loading || isRefreshing}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[350px] w-full px-3 pt-2">
        {(loading && notifications.length === 0) || isRefreshing ? (
          <div className="p-2 space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start gap-2 p-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-3 text-center">
            <p className="text-sm text-red-500 mb-2">Failed to load notifications</p>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1"
            >
              <span>Try again</span>
            </Button>
          </div>
        ) : limitedNotifications.length > 0 ? (
          <NotificationsList
            notifications={limitedNotifications}
            onViewDetail={handleViewNotification}
            onCompleteTask={handleCompleteTask}
            listType="dropdown"
          />
        ) : (
          <div className="p-3 text-center">
            <p className="text-sm text-zinc-500">No notifications to display</p>
            <Button
              variant="default"
              size="sm"
              onClick={handleRefresh}
              className="mt-2"
            >
              Refresh
            </Button>
          </div>
        )}
      </ScrollArea>
      
      <DropdownMenuSeparator />
      <div className="p-3">
        <Button
          onClick={handleViewAll}
          className="w-full flex items-center justify-center h-8"
          variant="outline"
          size="sm"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-2" />
          <span className="text-xs">View all notifications</span>
        </Button>
      </div>
    </div>
  );
}
