
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { RefreshCw, Bell, Eye, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Notification } from '@/types/notification';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onViewDetail: (id: string, relatedId?: string) => void;
  onCompleteTask: (id: string) => void;
  listType?: 'general' | 'scheduled';
}

export const NotificationList = ({
  notifications,
  loading,
  onViewDetail,
  onCompleteTask,
  listType = 'general'
}: NotificationListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-zinc-400 animate-spin" />
          <p className="mt-4 text-zinc-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            {listType === 'general' ? (
              <Bell className="h-10 w-10 text-zinc-300" />
            ) : (
              <Calendar className="h-10 w-10 text-zinc-300" />
            )}
            <h3 className="text-lg font-medium text-zinc-900">
              {listType === 'general' ? 'No notifications' : 'No scheduled reminders'}
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm">
              {listType === 'general'
                ? "You don't have any notifications yet. They'll appear here when there are updates to your events or tasks."
                : "You don't have any reminders scheduled. They'll appear here when you have upcoming tasks or deadlines."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="max-h-[calc(100vh-240px)]">
      <div className="space-y-4 pr-4">
        {notifications.map(notification => (
          <Card 
            key={notification.id} 
            className={`transition-all ${notification.read ? "opacity-70 border-zinc-100" : "border-zinc-200"}`}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="text-base font-medium text-zinc-900">{notification.title}</h3>
                    {!notification.read && (
                      <Badge variant="red" className="ml-2">
                        New
                      </Badge>
                    )}
                    {notification.type === "event_created" && (
                      <Badge variant="outline" className="ml-2 border-green-200 bg-green-50 text-green-700 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        New Event
                      </Badge>
                    )}
                    {notification.type === "event_incomplete" && (
                      <Badge variant="outline" className="ml-2 border-orange-200 bg-orange-50 text-orange-700 text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Attention needed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 mb-3">{notification.description}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => onViewDetail(notification.id, notification.relatedId)} 
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      
                      {notification.actionType === "approve" && (
                        <Button 
                          size="sm"
                          onClick={() => onCompleteTask(notification.id)}
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {listType === 'general' ? 'Approve' : 'Mark Complete'}
                        </Button>
                      )}
                    </div>
                    
                    <span className="text-xs text-zinc-500">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
