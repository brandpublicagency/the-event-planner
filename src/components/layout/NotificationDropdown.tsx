
import React from "react";
import { CheckCheck, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const NotificationDropdown: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.relatedId) {
      // Navigate based on notification type
      if (notification.type === "event_created" || notification.type === "event_incomplete") {
        navigate(`/events/${notification.relatedId}`);
      } else if (notification.type === "task_overdue" || notification.type === "task_upcoming") {
        navigate(`/tasks?selected=${notification.relatedId}`);
      }
    }
  };

  const handleApprove = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Show toast confirmation
    toast({
      title: "Approved",
      description: "The item has been approved",
      variant: "success",
    });
  };

  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Mark all as read
          </Button>
        )}
      </div>
      
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <h3 className="font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Automatically send new notifications
            </p>
          </div>
          <Switch />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div>
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={cn(
                  "border-b p-4 hover:bg-muted/20 transition-colors",
                  !notification.read && "bg-muted/10"
                )}
              >
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 rounded-full bg-primary/10">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center">
                      {getIconForNotificationType(notification.type)}
                    </div>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </p>
                    
                    <div className="mt-2 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction(notification)}
                        className="rounded-[3px]"
                      >
                        Review
                      </Button>
                      
                      {notification.actionType === "approve" && (
                        <Button 
                          size="sm"
                          onClick={() => handleApprove(notification)}
                          className="rounded-[3px]"
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t p-2">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => navigate("/notifications")}
        >
          See all notifications
        </Button>
      </div>
    </div>
  );
};

function getIconForNotificationType(type: Notification["type"]) {
  switch (type) {
    case "event_created":
      return <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">E</div>;
    case "task_overdue":
      return <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>;
    case "task_upcoming":
      return <div className="h-6 w-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs">T</div>;
    case "event_incomplete":
      return <div className="h-6 w-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">i</div>;
    default:
      return <div className="h-6 w-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">N</div>;
  }
}
