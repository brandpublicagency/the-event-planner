import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationsList } from "@/components/notifications/NotificationList";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Bell, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

  // Refresh notifications when component mounts, but only once
  useEffect(() => {
    if (!initialLoadAttempted) {
      setInitialLoadAttempted(true);
      refreshNotifications().catch(err => {
        console.error('Error refreshing notifications in dashboard:', err);
      });
    }
  }, [refreshNotifications, initialLoadAttempted]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshNotifications().catch(err => {
      console.error("Error manually refreshing notifications:", err);
    }).finally(() => {
      setIsRefreshing(false);
    });
  }, [refreshNotifications]);
  const handleNotificationView = useCallback((id: string, relatedId?: string) => {
    // Mark notification as read
    markAsRead(id).then(() => {
      // Navigate to related content if available
      if (relatedId) {
        if (relatedId.startsWith('EVENT-')) {
          navigate(`/events/${relatedId}`);
        } else if (relatedId.includes('task_')) {
          navigate(`/tasks?selected=${relatedId}`);
        }
      }
    }).catch(err => {
      console.error('Error marking notification as read:', err);
      toast("Could not mark notification as read");
    });
  }, [markAsRead, navigate]);
  const handleNotificationComplete = useCallback((id: string) => {
    markAsCompleted(id).catch(err => {
      console.error('Error marking notification as completed:', err);
      toast("Could not complete notification");
    });
  }, [markAsCompleted]);

  // Handle marking all notifications as read
  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead().then(() => {
      toast("All notifications marked as read");
    }).catch(err => {
      console.error('Error marking all notifications as read:', err);
      toast("Could not mark all notifications as read");
    });
  }, [markAllAsRead]);
  if (error) {
    return <Alert variant="destructive" className="mt-2 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex justify-between items-center">
          <span>There was a problem loading notifications</span>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>;
  }

  // Get a limited number of notifications
  const limitedNotifications = notifications.slice(0, 3);
  return <div className="flex flex-col">
      {/* Notification heading - using the same style as NotificationDropdown */}
      <div className="flex items-centre justify-between p-3 border-b rounded-t-lg py-[20px] rounded-md bg-red-100">
        <div className="flex flex-col">
          <p className="text-zinc-900 text-xl font-semibold">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {notifications.filter(n => !n.read).length > 0 ? `You have ${notifications.filter(n => !n.read).length} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleMarkAllAsRead} variant="ghost" size="sm" className="h-8 px-2 text-xs" disabled={!notifications.some(n => !n.read) || loading || isRefreshing}>
            <Check className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
          <Button onClick={handleRefresh} variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={loading || isRefreshing}>
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Show skeleton loader while loading initial data */}
      {loading && notifications.length === 0 || isRefreshing ? <div className="space-y-3 p-3 bg-white rounded-b-lg shadow-sm">
          {Array.from({
        length: 2
      }).map((_, index) => <div key={index} className="flex items-start gap-3 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>)}
        </div> : <div className="h-auto mx-0 px-0 py-0 my-[10px] rounded bg-[#000a0e]/0">
          {limitedNotifications.length > 0 ? <NotificationsList notifications={limitedNotifications} onViewDetail={handleNotificationView} onCompleteTask={handleNotificationComplete} /> : <div className="bg-white shadow rounded-lg p-4 text-center">
              <p className="text-sm text-zinc-500">
                {loading ? "Loading notifications..." : "No notifications to display"}
              </p>
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="mt-2">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>}
        </div>}
    </div>;
};
export default DashboardNotificationsSection;