
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
import { useToast } from "@/hooks/use-toast";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationsList } from "@/components/notifications/NotificationList";
import { NotificationFooter } from "@/components/notifications/NotificationFooter";

export const NotificationDropdown: React.FC = () => {
  const {
    notifications: generalNotifications,
    markAsRead: markGeneralAsRead,
  } = useNotifications();
  
  const {
    notifications: scheduledNotifications,
    markAsRead: markScheduledAsRead,
    markAsCompleted
  } = useScheduledNotifications();
  
  // Combine notifications and sort by date
  const allNotifications = useMemo(() => {
    return [...generalNotifications, ...scheduledNotifications]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5); // Limit to top 5 for the dropdown
  }, [generalNotifications, scheduledNotifications]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAction = async (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      // Try both mark as read methods - one will succeed based on notification type
      await Promise.allSettled([
        markGeneralAsRead(notification.id),
        markScheduledAsRead(notification.id)
      ]);
      
      if (notification.relatedId) {
        // Navigate based on notification type
        if (notification.type === "event_created" || notification.type === "event_incomplete") {
          navigate(`/events/${notification.relatedId}`);
        } else if (notification.type.includes("task")) {
          navigate(`/tasks?selected=${notification.relatedId}`);
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  
  const handleApprove = async (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      await markAsCompleted(notification.id);
      
      // Show toast confirmation
      toast({
        title: "Task Completed",
        description: "The item has been marked as completed",
        variant: "success",
        showProgress: true,
        duration: 3000
      });
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Could not complete the task",
        variant: "destructive",
        duration: 3000
      });
    }
  };
  
  const handleClickAllNotifications = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/notifications");
  };
  
  // Total unread count across both notification types
  const totalUnreadCount = generalNotifications.filter(n => !n.read).length + 
                          scheduledNotifications.filter(n => !n.read).length;
  
  return (
    <div className="max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <NotificationHeader title="Notifications" />
      
      <ScrollArea className="overflow-y-auto flex-1">
        <NotificationsList 
          notifications={allNotifications}
          onView={handleAction}
          onComplete={handleApprove}
        />
      </ScrollArea>
      
      <NotificationFooter 
        unreadCount={totalUnreadCount} 
        onViewAll={handleClickAllNotifications} 
      />
    </div>
  );
};
