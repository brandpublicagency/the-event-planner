
import React, { useState, useCallback, useMemo } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NotificationDropdown() {
  const { notifications, markAsRead, markAsCompleted, refreshNotifications } = useNotifications();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Memoize filtered notifications to prevent unnecessary calculations
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter(n => !n.read);
    } 
    if (activeTab === 'tasks') {
      return notifications.filter(n => n.type.includes('task'));
    }
    return notifications.slice(0, 15); // Limit to 15 notifications to improve performance
  }, [notifications, activeTab]);

  // Use useCallback for event handlers to prevent unnecessary rerenders
  const handleViewNotification = useCallback(async (id: string, relatedId?: string) => {
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
  }, [markAsRead, navigate]);

  const handleCompleteTask = useCallback(async (id: string) => {
    try {
      await markAsCompleted(id);
      toast.success(`Task marked as complete!`);
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast.error("Failed to mark task as complete");
    }
  }, [markAsCompleted]);

  const handleViewAll = useCallback(() => {
    navigate('/notifications');
  }, [navigate]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refreshNotifications();
      toast.success('Notifications refreshed');
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      toast.error('Failed to refresh notifications');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshNotifications, isRefreshing]);

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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 p-1 h-auto">
          <TabsTrigger value="all" className="text-xs h-8">All</TabsTrigger>
          <TabsTrigger value="unread" className="text-xs h-8">
            Unread
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs h-8">Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[350px] w-full">
            {filteredNotifications.length > 0 ? (
              <NotificationsList
                notifications={filteredNotifications}
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
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          <ScrollArea className="h-[350px] w-full">
            {filteredNotifications.length > 0 ? (
              <NotificationsList
                notifications={filteredNotifications}
                onViewDetail={handleViewNotification}
                onCompleteTask={handleCompleteTask}
                listType="unread"
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-zinc-500">No unread notifications</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-0">
          <ScrollArea className="h-[350px] w-full">
            {filteredNotifications.length > 0 ? (
              <NotificationsList
                notifications={filteredNotifications}
                onViewDetail={handleViewNotification}
                onCompleteTask={handleCompleteTask}
                listType="tasks"
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-zinc-500">No task notifications</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
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
