
import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
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
  
  const handleAction = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    markAsRead(notification.id);
    if (notification.relatedId) {
      // Navigate based on notification type
      if (notification.type === "event_created" || notification.type === "event_incomplete") {
        navigate(`/events/${notification.relatedId}`);
      } else if (notification.type.includes("task")) {
        navigate(`/tasks?selected=${notification.relatedId}`);
      }
    }
  };
  
  const handleApprove = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    markAsRead(notification.id);

    // Show toast confirmation
    toast({
      title: "Approved",
      description: "The item has been approved",
      variant: "success"
    });
  };
  
  const handleClickAllNotifications = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/notifications");
  };
  
  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={e => {
              e.stopPropagation();
              markAllAsRead();
            }} 
            className="text-xs text-zinc-700 font-light"
          >
            Clear All
          </Button>
        )}
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-zinc-900">{notification.title}</h4>
                      {!notification.read && (
                        <Badge 
                          variant="default" 
                          className="text-[10px] py-0.5 text-white font-normal rounded px-[8px] bg-zinc-900"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm my-0 py-px font-light text-zinc-900">
                      {notification.description}
                    </p>
                    
                    <div className="mt-2 flex items-center gap-2 justify-between">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={e => handleAction(notification, e)} 
                          className="rounded text-gray-900 bg-white"
                        >
                          Review
                        </Button>
                        
                        {notification.actionType === "approve" && (
                          <Button 
                            size="sm" 
                            onClick={e => handleApprove(notification, e)} 
                            className="rounded-md"
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground m-0">
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
      </div>
      
      <div className="border-t p-2">
        <Button 
          variant="default" 
          onClick={handleClickAllNotifications} 
          className="w-full rounded text-zinc-800 bg-zinc-300 hover:bg-zinc-200"
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
    case "task_created":
      return <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">T</div>;
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
