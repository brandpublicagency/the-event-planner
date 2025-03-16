
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { 
  Calendar, 
  AlertTriangle, 
  AlarmClock, 
  FileText, 
  CreditCard, 
  Clock,
  CheckCircle 
} from "lucide-react";
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
        "p-4 mb-3 rounded-lg border border-zinc-100 shadow-sm bg-white",
        !notification.read && "border-zinc-200",
        notification.status === 'pending' && "border-l-4 border-l-orange-500",
        notification.type === 'task_overdue' && !notification.read && "border-l-4 border-l-red-500"
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <NotificationIcon type={notification.type} status={notification.status} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="font-medium text-sm text-zinc-900">{notification.title}</h4>
            <NotificationStatusBadge status={notification.status} type={notification.type} />
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

const NotificationIcon: React.FC<{ type: Notification['type'], status?: string }> = ({ type, status }) => {
  switch (type) {
    case "event_created":
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-green-600" />
        </div>
      );
    case "event_incomplete":
      return (
        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
          <FileText className="h-4 w-4 text-amber-600" />
        </div>
      );
    case "proforma_reminder":
      return (
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <CreditCard className="h-4 w-4 text-blue-600" />
        </div>
      );
    case "task_upcoming":
      return (
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <AlarmClock className="h-4 w-4 text-blue-600" />
        </div>
      );
    case "task_overdue":
      return (
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
      );
    default:
      return (
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-purple-600" />
        </div>
      );
  }
};

const NotificationStatusBadge: React.FC<{ status?: string, type: Notification['type'] }> = ({ status, type }) => {
  if (status === 'pending') {
    return (
      <Badge 
        variant="outline" 
        className="text-[10px] py-0 h-4 text-orange-700 font-normal rounded px-[6px] bg-orange-50 border-orange-200"
      >
        <Clock className="h-3 w-3 mr-1" />
        Scheduled
      </Badge>
    );
  }
  
  if (status === 'completed') {
    return (
      <Badge 
        variant="outline" 
        className="text-[10px] py-0 h-4 text-green-700 font-normal rounded px-[6px] bg-green-50 border-green-200"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed
      </Badge>
    );
  }
  
  if (type === "task_overdue") {
    return (
      <Badge 
        variant="outline" 
        className="text-[10px] py-0 h-4 text-red-700 font-normal rounded px-[6px] bg-red-50 border-red-200"
      >
        <AlertTriangle className="h-3 w-3 mr-1" />
        Overdue
      </Badge>
    );
  }
  
  if (!status || status === 'read') {
    return null;
  }
  
  return (
    <Badge 
      variant="default" 
      className="text-[10px] py-0 h-4 text-white font-normal rounded px-[6px] bg-zinc-900"
    >
      New
    </Badge>
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
