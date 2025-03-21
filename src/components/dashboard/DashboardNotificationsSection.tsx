
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationsList } from "@/components/notifications/NotificationList";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  
  // Refresh notifications when component mounts, but only once
  useEffect(() => {
    refreshNotifications().catch(err => {
      console.error('Error refreshing notifications:', err);
    });
  }, [refreshNotifications]);
  
  const handleNotificationView = (id: string, relatedId?: string) => {
    // Mark notification as read
    markAsRead(id).catch(err => console.error('Error marking notification as read:', err));
    
    // Navigate to related content if available
    if (relatedId) {
      if (relatedId.startsWith('EVENT-')) {
        navigate(`/events/${relatedId}`);
      } else if (relatedId.includes('task_')) {
        navigate(`/tasks?selected=${relatedId}`);
      }
    }
  };
  
  const handleNotificationComplete = (id: string) => {
    markAsCompleted(id).catch(err => console.error('Error marking notification as completed:', err));
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mt-2 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          There was a problem loading notifications
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col mt-2">
      <div className="h-auto">
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <Spinner className="h-6 w-6 text-primary" />
          </div>
        ) : (
          <NotificationsList 
            notifications={notifications.slice(0, 3)} 
            onViewDetail={handleNotificationView}
            onCompleteTask={handleNotificationComplete}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardNotificationsSection;
