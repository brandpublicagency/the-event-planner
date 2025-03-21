
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationsList } from "@/components/notifications/NotificationList";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardNotificationsSection = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAsCompleted, 
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
    refreshNotifications()
      .catch(err => {
        console.error("Error manually refreshing notifications:", err);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [refreshNotifications]);
  
  const handleNotificationView = useCallback((id: string, relatedId?: string) => {
    // Mark notification as read
    markAsRead(id)
      .then(() => {
        // Navigate to related content if available
        if (relatedId) {
          if (relatedId.startsWith('EVENT-')) {
            navigate(`/events/${relatedId}`);
          } else if (relatedId.includes('task_')) {
            navigate(`/tasks?selected=${relatedId}`);
          }
        }
      })
      .catch(err => {
        console.error('Error marking notification as read:', err);
        toast("Could not mark notification as read");
      });
  }, [markAsRead, navigate]);
  
  const handleNotificationComplete = useCallback((id: string) => {
    markAsCompleted(id)
      .catch(err => {
        console.error('Error marking notification as completed:', err);
        toast("Could not complete notification");
      });
  }, [markAsCompleted]);

  if (error) {
    return (
      <Alert variant="destructive" className="mt-2 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex justify-between items-center">
          <span>There was a problem loading notifications</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Get a limited number of notifications
  const limitedNotifications = notifications.slice(0, 3);

  // Show skeleton loader while loading initial data
  if ((loading && notifications.length === 0) || isRefreshing) {
    return (
      <div className="flex flex-col mt-2">
        <div className="space-y-3 p-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3 p-2 bg-white rounded-lg shadow">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If we have notifications, show them
  return (
    <div className="flex flex-col mt-2">
      <div className="h-auto">
        {limitedNotifications.length > 0 ? (
          <NotificationsList 
            notifications={limitedNotifications} 
            onViewDetail={handleNotificationView}
            onCompleteTask={handleNotificationComplete}
          />
        ) : (
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <p className="text-sm text-zinc-500">
              {loading ? "Loading notifications..." : "No notifications to display"}
            </p>
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
      </div>
    </div>
  );
};

export default DashboardNotificationsSection;
