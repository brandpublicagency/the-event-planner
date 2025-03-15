
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { CheckCircle, ArrowRight, Calendar, Bell } from "lucide-react";

export const ScheduledNotificationDropdown: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAsCompleted
  } = useScheduledNotifications();
  const navigate = useNavigate();
  
  const handleViewEvent = (notificationId: string, eventCode: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Mark as read
    markAsRead(notificationId);
    
    // Navigate to event if we have an event code
    if (eventCode) {
      navigate(`/events/${eventCode}`);
    }
  };
  
  const handleCompleteTask = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    markAsCompleted(notificationId);
  };
  
  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b flex items-center justify-between bg-zinc-50">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <h2 className="text-xl font-semibold">Scheduled Reminders</h2>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No pending reminders
          </div>
        ) : (
          <div>
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={cn(
                  "border-b p-4 hover:bg-muted/10 transition-colors", 
                  !notification.read && "bg-blue-50"
                )}
              >
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-zinc-900">{notification.title}</h4>
                      {!notification.read && (
                        <Badge 
                          variant="default" 
                          className="text-[10px] py-0.5 text-white font-normal rounded px-[8px] bg-blue-600"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm my-1 font-light text-zinc-800">
                      {notification.description}
                    </p>
                    
                    <div className="mt-2 flex items-center gap-2 justify-between">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={e => handleViewEvent(notification.id, notification.relatedId, e)} 
                          className="rounded-md bg-white border-zinc-200 hover:bg-zinc-100"
                        >
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          View Event
                        </Button>
                        
                        {notification.actionType === "approve" && (
                          <Button 
                            variant="default"
                            size="sm" 
                            onClick={e => handleCompleteTask(notification.id, e)} 
                            className="rounded-md bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Mark Completed
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
      
      <div className="border-t p-2 bg-zinc-50">
        <Button 
          variant="outline" 
          onClick={() => navigate("/notifications")} 
          className="w-full rounded text-zinc-800 bg-white border-zinc-200 hover:bg-zinc-100"
        >
          See all notifications
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};
