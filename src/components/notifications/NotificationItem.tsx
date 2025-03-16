
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { Calendar, AlertTriangle, AlarmClock, FileText, CreditCard, Clock, Info, Bell } from "lucide-react";
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
  // Determine if the notification needs a special border based on status or type
  const isUrgent = notification.type === 'task_overdue' || 
                  (notification.status === 'pending' && new Date(notification.createdAt) < new Date());
  
  return (
    <div 
      key={notification.id} 
      className={cn(
        "p-4 mb-3 rounded-lg border shadow-sm bg-white",
        !notification.read && "border-zinc-200",
        notification.status === 'pending' && "border-l-4 border-l-orange-400",
        isUrgent && "border-l-4 border-l-red-500"
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="font-medium text-sm text-zinc-900">{notification.title}</h4>
            {notification.status === 'pending' && (
              <Badge 
                variant="outline" 
                className="text-[10px] py-0 h-4 text-orange-700 font-normal rounded px-[6px] bg-orange-50 border-orange-200"
              >
                <Clock className="h-3 w-3 mr-1" />
                Scheduled
              </Badge>
            )}
            {notification.status === 'completed' && (
              <Badge 
                variant="outline" 
                className="text-[10px] py-0 h-4 text-green-700 font-normal rounded px-[6px] bg-green-50 border-green-200"
              >
                Completed
              </Badge>
            )}
            {!notification.read && notification.status !== 'pending' && notification.status !== 'completed' && (
              <Badge 
                variant="default" 
                className="text-[10px] py-0 h-4 text-white font-normal rounded px-[6px] bg-zinc-900"
              >
                New
              </Badge>
            )}
            {isUrgent && notification.status === 'pending' && (
              <Badge 
                variant="outline" 
                className="text-[10px] py-0 h-4 text-red-700 font-normal rounded px-[6px] bg-red-50 border-red-200"
              >
                Overdue
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

// New component to display notification icon with appropriate color
const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  // Define the icon and color for each notification type
  switch (type) {
    case "event_created":
    case "event_created_unified":
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <Calendar className="h-4 w-4" />
        </div>
      );
    case "event_incomplete":
      return (
        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <FileText className="h-4 w-4" />
        </div>
      );
    case "proforma_reminder":
      return (
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <CreditCard className="h-4 w-4" />
        </div>
      );
    case "task_upcoming":
      return (
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <AlarmClock className="h-4 w-4" />
        </div>
      );
    case "task_overdue":
      return (
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlarmClock className="h-4 w-4" />
        </div>
      );
    case "task_created":
      return (
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
          <Info className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          <Bell className="h-4 w-4" />
        </div>
      );
  }
};

const NotificationTypeBadge: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  if (type === "event_created" || type === "event_created_unified") {
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
        <FileText className="h-3 w-3 mr-1" />
        Document
      </Badge>
    );
  }
  
  if (type === "proforma_reminder") {
    return (
      <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 border-blue-200 bg-blue-50 text-blue-700">
        <CreditCard className="h-3 w-3 mr-1" />
        Invoice
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
  
  return (
    <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4 border-purple-200 bg-purple-50 text-purple-700">
      <AlertTriangle className="h-3 w-3 mr-1" />
      Alert
    </Badge>
  );
};
