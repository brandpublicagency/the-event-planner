
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { Calendar, AlertTriangle, AlarmClock, FileText, CreditCard, Info, Bell, CheckCircle } from "lucide-react";
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
  const isUrgent = notification.type === 'task_overdue' || 
                   notification.type === 'document_due_reminder' ||
                   notification.type === 'payment_reminder';
  
  // Get the appropriate icon based on notification type
  const getNotificationIcon = () => {
    switch(notification.type) {
      case 'event_created':
      case 'event_created_unified':
        return <Calendar className="h-4 w-4 text-emerald-500" />;
      case 'task_overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'task_upcoming':
        return <AlarmClock className="h-4 w-4 text-amber-500" />;
      case 'document_due_reminder':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'payment_reminder':
      case 'final_payment_reminder':
        return <CreditCard className="h-4 w-4 text-violet-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div 
      key={notification.id} 
      className={cn(
        "p-4 mb-3 rounded-lg border shadow-sm",
        notification.read ? "bg-white" : "bg-white",
        !notification.read && "border-zinc-200",
        isUrgent && !notification.read && "border-l-4 border-l-red-500"
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex items-start pt-0.5">
          {getNotificationIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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
