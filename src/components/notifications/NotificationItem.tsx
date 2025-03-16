
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { Calendar, AlertTriangle, AlarmClock } from "lucide-react";
import { NotificationActions } from "./NotificationActions";

interface NotificationItemProps {
  notification: Notification;
  onView: (notification: Notification, e: React.MouseEvent) => void;
  onComplete: (notification: Notification, e: React.MouseEvent) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onView, 
  onComplete 
}) => {
  return (
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
            <NotificationTypeBadge type={notification.type} />
          </div>
          <p className="text-xs my-1 text-zinc-600 line-clamp-2">
            {notification.description}
          </p>
          
          <div className="mt-2 flex items-center gap-1.5 justify-between">
            <NotificationActions 
              notification={notification}
              onView={onView}
              onComplete={onComplete}
            />
            <p className="text-[10px] text-zinc-500 m-0">
              {formatDistanceToNow(notification.createdAt, {
                addSuffix: true
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationTypeBadge: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  if (type === "event_created") {
    return (
      <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 border-green-200 bg-green-50 text-green-700">
        <Calendar className="h-3 w-3 mr-1" />
        Event
      </Badge>
    );
  }
  
  if (type === "event_incomplete") {
    return (
      <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 border-orange-200 bg-orange-50 text-orange-700">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Alert
      </Badge>
    );
  }
  
  if (type === "task_upcoming" || type === "task_overdue") {
    return (
      <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 border-blue-200 bg-blue-50 text-blue-700">
        <AlarmClock className="h-3 w-3 mr-1" />
        Reminder
      </Badge>
    );
  }
  
  return null;
};
