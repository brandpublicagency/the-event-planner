
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationsList } from "@/components/notifications/NotificationList";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/types/notification";

const DashboardNotificationsSection = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markAsRead,
    markAsCompleted,
    markAllAsRead,
    refreshNotifications,
    loading,
    error
  } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  useEffect(() => {
    if (!initialLoadAttempted) {
      setInitialLoadAttempted(true);
      refreshNotifications().catch(err => {
        console.error('Error refreshing notifications in dashboard:', err);
      });
    }
  }, [refreshNotifications, initialLoadAttempted]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshNotifications().catch(err => {
      console.error("Error manually refreshing notifications:", err);
    }).finally(() => {
      setIsRefreshing(false);
    });
  }, [refreshNotifications]);

  const handleNotificationView = useCallback((notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    markAsRead(notification.id).then(() => {
      if (notification.relatedId) {
        if (notification.relatedId.match(/^\d+-\d+$/) || notification.relatedId.startsWith('EVENT-') || notification.relatedId.startsWith('event_')) {
          const eventCode = notification.relatedId.startsWith('EVENT-') 
            ? notification.relatedId.replace('EVENT-', '') 
            : notification.relatedId.startsWith('event_') 
              ? notification.relatedId.replace('event_', '') 
              : notification.relatedId;
              
          console.log(`Dashboard notification: navigating to event: ${eventCode}`);
          navigate(`/events/${eventCode}`);
        } else if (notification.relatedId.startsWith('task_')) {
          navigate(`/tasks?selected=${notification.relatedId}`);
        } else {
          navigate(`/${notification.relatedId}`);
        }
      }
    }).catch(err => {
      console.error('Error marking notification as read:', err);
      toast("Could not mark notification as read");
    });
  }, [markAsRead, navigate]);

  const handleNotificationComplete = useCallback((notification: Notification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    markAsCompleted(notification.id).catch(err => {
      console.error('Error marking notification as completed:', err);
      toast("Could not complete notification");
    });
  }, [markAsCompleted]);

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead().then(() => {
      toast("All notifications marked as read");
    }).catch(err => {
      console.error('Error marking all notifications as read:', err);
      toast("Could not mark all notifications as read");
    });
  }, [markAllAsRead]);

  const handleViewAllNotifications = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/notifications');
  }, [navigate]);

  if (error) {
    return (
      <Alert variant="destructive" className="mt-2 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex justify-between items-center">
          <span>There was a problem loading notifications</span>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2 h-7">
            <RefreshCw className="h-3 w-3 mr-1" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const limitedNotifications = notifications.slice(0, 3);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 py-[12px] mt-[15px]">
        <div className="flex flex-col">
          <p className="text-lg font-medium text-gray-800">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {notifications.filter(n => !n.read).length > 0 ? `You have ${notifications.filter(n => !n.read).length} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button onClick={handleMarkAllAsRead} variant="ghost" size="sm" disabled={!notifications.some(n => !n.read) || loading || isRefreshing} className="h-7 text-xs bg-white rounded-md px-2">
            <Check className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
          <Button onClick={handleRefresh} variant="ghost" size="sm" disabled={loading || isRefreshing} className="h-7 w-7 p-0 bg-white rounded-md">
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {loading && notifications.length === 0 || isRefreshing ? (
        <div className="space-y-2 p-2 bg-white rounded-b-lg shadow-sm">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-start gap-2 p-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-auto mx-0 px-0 py-0 my-2 rounded bg-[#000a0e]/0">
          {limitedNotifications.length > 0 ? (
            <NotificationsList 
              notifications={limitedNotifications} 
              onViewDetail={handleNotificationView} 
              onCompleteTask={handleNotificationComplete} 
              listType="dashboard"
            />
          ) : (
            <div className="bg-white shadow-sm rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500">
                {loading ? "Loading notifications..." : "No notifications to display"}
              </p>
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="mt-2 h-7">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          )}
        </div>
      )}
      {notifications.length > 3 && (
        <div className="mt-2 text-right">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAllNotifications} 
            className="text-xs text-primary hover:bg-primary/5"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardNotificationsSection;
