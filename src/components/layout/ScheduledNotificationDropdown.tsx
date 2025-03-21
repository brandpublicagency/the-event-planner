
import React from 'react';
import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

export function ScheduledNotificationDropdown() {
  // Using the regular notification context since we're rebuilding
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAsCompleted,
    refreshNotifications
  } = useNotifications();
  
  const handleMarkAsRead = (id: string) => {
    markAsRead(id).then(() => {
      toast.success("Notification marked as read", {
        duration: 2000
      });
    });
  };
  
  const handleMarkAsCompleted = (id: string) => {
    markAsCompleted(id).then(() => {
      toast.success("Task marked as completed", {
        duration: 2000
      });
    });
  };

  return (
    <div className="flex flex-col max-h-[85vh]">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h3 className="font-medium text-base text-zinc-900">Task Reminders</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refreshNotifications()}
            className="h-7 px-2 text-xs"
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
              <Link to="/notifications?tab=scheduled">
                View All ({unreadCount})
              </Link>
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-zinc-500">
            <div className="flex flex-col items-center gap-2">
              <Clock className="h-6 w-6 text-zinc-300" />
              <p>No pending reminders</p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            {notifications.slice(0, 5).map((notification) => (
              <Card
                key={notification.id}
                className={`mx-2 my-1.5 p-3 ${!notification.read ? '' : 'opacity-70'} border-zinc-200`}
              >
                <div className="flex justify-between items-start gap-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-sm text-zinc-900">{notification.title}</h4>
                      {!notification.read && (
                        <Badge 
                          variant="default" 
                          className="text-[10px] py-0 h-4 text-white font-normal px-[6px] bg-zinc-900"
                        >
                          New
                        </Badge>
                      )}
                      {notification.type === 'task_overdue' && (
                        <Badge variant="destructive" className="text-[10px] py-0 h-4">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{notification.description}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 min-w-[60px] text-right">
                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Mark Read
                  </Button>
                  {notification.actionType === "review" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleMarkAsCompleted(notification.id)}
                      className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    asChild
                    className="h-7 px-2 text-xs ml-auto"
                  >
                    <Link to={notification.relatedId ? `/events/${notification.relatedId}` : '/events'}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
            {notifications.length > 5 && (
              <div className="text-center p-2">
                <Button variant="ghost" size="sm" asChild className="text-xs">
                  <Link to="/notifications?tab=scheduled">
                    View All ({notifications.length})
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
