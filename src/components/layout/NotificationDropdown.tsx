
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Eye, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  };
  
  const handleClickAllNotifications = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/notifications");
  };
  
  return (
    <div className="max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="p-3 border-b flex items-center justify-between">
        <h2 className="text-base font-medium text-zinc-900">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={e => {
              e.stopPropagation();
              markAllAsRead();
              toast({
                title: "All notifications marked as read",
                variant: "success",
                showProgress: true,
                duration: 2000
              });
            }} 
            className="text-xs text-zinc-600 h-7 px-2"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <ScrollArea className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-zinc-500">
            No notifications yet
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-3 hover:bg-zinc-50 transition-colors", 
                  !notification.read && "bg-zinc-50/50"
                )}
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-medium text-sm text-zinc-900">{notification.title}</h4>
                      {!notification.read && (
                        <Badge 
                          variant="default" 
                          className="text-[10px] py-0 h-4 text-white font-normal rounded px-[6px] bg-zinc-900"
                        >
                          New
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
                            Approve
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
          See all notifications
        </Button>
      </div>
    </div>
  );
};
