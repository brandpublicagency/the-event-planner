
import React from "react";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Info, Calendar, FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationsListProps {
  notifications: Notification[];
  onViewDetail: (id: string, relatedId?: string) => void;
  onCompleteTask: (id: string) => void;
}

export function NotificationsList({ 
  notifications, 
  onViewDetail, 
  onCompleteTask 
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
        <Info className="h-10 w-10 mb-2 opacity-50" />
        <p className="text-sm">No notifications to display</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={cn(
            "p-4 hover:bg-gray-50 cursor-pointer transition-colors", 
            !notification.read && "bg-blue-50"
          )}
        >
          <div 
            className="flex gap-3" 
            onClick={() => onViewDetail(notification.id, notification.relatedId)}
          >
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {notification.description}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                </span>
                {notification.type.includes('task') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompleteTask(notification.id);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    type="button"
                  >
                    Mark as complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getNotificationIcon(type: string) {
  if (type.includes('task')) {
    return <CheckCircle className="h-5 w-5 text-teal-500" />;
  }
  if (type.includes('event')) {
    return <Calendar className="h-5 w-5 text-blue-500" />;
  }
  if (type.includes('document')) {
    return <FileText className="h-5 w-5 text-amber-500" />;
  }
  if (type.includes('payment')) {
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  }
  return <Info className="h-5 w-5 text-blue-500" />;
}
