
import React from 'react';
import { useScheduledNotifications } from "@/contexts/ScheduledNotificationContext";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";

export function ScheduledNotificationDropdown() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAsCompleted,
    loading
  } = useScheduledNotifications();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="font-medium">Task Reminders</h3>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/notifications?tab=scheduled">
              View All ({unreadCount})
            </Link>
          </Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No pending reminders
          </div>
        ) : (
          <div className="py-2">
            {notifications.slice(0, 5).map((notification) => (
              <Card
                key={notification.id}
                className={`mx-2 my-1 p-3 ${notification.read ? 'opacity-70' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.description}</p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => markAsRead(notification.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Mark Read
                  </Button>
                  {notification.actionType === 'approve' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => markAsCompleted(notification.id)}
                      className="h-7 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    asChild
                    className="h-7 px-2 text-xs ml-auto"
                  >
                    <Link to={`/events/${notification.relatedId}`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
            {notifications.length > 5 && (
              <div className="text-center p-2">
                <Button variant="ghost" size="sm" asChild>
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
