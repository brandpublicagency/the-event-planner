
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
      <div className="flex items-center justify-between p-4 rounded-xl mb-4 relative" style={{
        backgroundImage: 'url(https://www.warmkaroo.com/wp-content/uploads/2025/03/WK-Profile.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '15px'
      }}>
        <div className="absolute inset-0 bg-white/75 rounded-xl"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <Bell className="h-5 w-5 text-zinc-700" />
          <h3 className="text-lg font-medium text-zinc-900">Latest Updates</h3>
        </div>
        <Button 
          onClick={() => refreshNotifications()} 
          size="sm" 
          variant="outline" 
          className="rounded-full relative z-10"
        >
          Refresh
        </Button>
      </div>
      
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
