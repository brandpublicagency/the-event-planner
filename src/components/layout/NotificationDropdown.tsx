
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Eye, Calendar, AlarmClock, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div className="p-3 border-b flex items-center justify-between">
        <h2 className="text-base font-medium text-zinc-900">Notifications</h2>
        {/* Removed "Clear All" button as per request */}
      </div>
      
      <ScrollArea className="overflow-y-auto flex-1">
        {allNotifications.length === 0 ? (
          <div className="p-6 text-center text-zinc-500">
            No notifications yet
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {allNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-3 hover:bg-zinc-50 transition-colors", 
                  !notification.read && "bg-zinc-50/50"
                )}
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h4 className="font-medium text-sm text-zinc-900">{notification.title}</h4>
                      {!notification.read && (
                        <Badge 
                          variant="default" 
                          className="text-[10px] py-0 h-4 text-white font-normal rounded px-[6px] bg-zinc-900"
                        >
                          New
                        </Badge>
                      )}
                      {notification.type === "event_created" && (
                        <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 border-green-200 bg-green-50 text-green-700">
                          <Calendar className="h-3 w-3 mr-1" />
                          Event
                        </Badge>
                      )}
                      {notification.type === "event_incomplete" && (
                        <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 border-orange-200 bg-orange-50 text-orange-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Alert
                        </Badge>
                      )}
                      {(notification.type === "task_upcoming" || notification.type === "task_overdue") && (
                        <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 border-blue-200 bg-blue-50 text-blue-700">
                          <AlarmClock className="h-3 w-3 mr-1" />
                          Reminder
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs my-1 text-zinc-600 line-clamp-2">
                      {notification.description}
                    </p>
                    
                    <div className="mt-2 flex items-center gap-1.5 justify-between">
                      <div className="flex gap-1.5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={e => handleAction(notification, e)} 
                          className="h-7 px-2 text-xs rounded"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        
                        {notification.actionType === "approve" && (
                          <Button 
                            size="sm" 
                            onClick={e => handleApprove(notification, e)} 
                            className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 m-0">
                        {formatDistanceToNow(notification.createdAt, {
                          addSuffix: true
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t p-2">
        <Button 
          variant="outline" 
          onClick={handleClickAllNotifications} 
          className="w-full rounded text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border-zinc-200"
        >
          {totalUnreadCount > 5 ? `See all notifications (${totalUnreadCount})` : 'See all notifications'}
        </Button>
      </div>
    </div>
  );
};
