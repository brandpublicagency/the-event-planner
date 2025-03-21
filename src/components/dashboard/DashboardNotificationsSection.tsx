
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationsList } from "@/components/notifications/NotificationList";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useEffect } from "react";

const DashboardNotificationsSection = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAsCompleted, 
    refreshNotifications
  } = useNotifications();
  
  // Refresh notifications when component mounts
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
      if (relatedId.includes('event_')) {
        navigate(`/events/${relatedId}`);
      } else if (relatedId.includes('task_')) {
        navigate(`/tasks?selected=${relatedId}`);
      }
    }
  };
  
  const handleNotificationComplete = (id: string) => {
    markAsCompleted(id).catch(err => console.error('Error marking notification as completed:', err));
  };

  return (
    <div className="flex flex-col mt-2">
      <div className="h-auto">
        <NotificationsList 
          notifications={notifications.slice(0, 3)} 
          onViewDetail={handleNotificationView}
          onCompleteTask={handleNotificationComplete}
        />
      </div>
    </div>
  );
};

export default DashboardNotificationsSection;
