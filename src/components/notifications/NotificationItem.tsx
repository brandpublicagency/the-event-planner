
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { Calendar, AlertTriangle, AlarmClock, FileText, CreditCard, Info, Bell } from "lucide-react";
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
  // Determine if the notification needs special styling based on type
  const isUrgent = notification.type === 'task_overdue';
  
  return (
    <div 
      key={notification.id} 
      className={cn(
        "p-4 mb-3 rounded-lg border shadow-sm bg-white",
        !notification.read && "border-zinc-200"
      )}
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="font-medium text-sm text-zinc-900">{notification.title}</h4>
            {notification.status === 'completed' && (
              <Badge 
                variant="outline" 
                className="text-[10px] py-0 h-4 text-green-700 font-normal rounded px-[6px] bg-green-50 border-green-200"
              >
                Completed
              </Badge>
            )}
            {!notification.read && notification.status !== 'completed' && (
              <Badge 
                variant="default" 
                className="text-[10px] py-0 h-4 text-white font-normal rounded px-[6px] bg-zinc-900"
              >
                New
              </Badge>
            )}
            {isUrgent && (
              <Badge 
                variant="outline" 
                className="text-[10px] py-0 h-4 text-red-700 font-normal rounded px-[6px] bg-red-50 border-red-200"
              >
                Urgent
              </Badge>
            )}
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
