
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: (e: React.MouseEvent) => void;
  onRefresh: (e: React.MouseEvent) => void;
  loading: boolean;
  isRefreshing: boolean;
}

export const NotificationHeader = ({ 
  unreadCount, 
  onMarkAllAsRead, 
  onRefresh, 
  loading, 
  isRefreshing 
}: NotificationHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex flex-col">
        <p className="text-sm font-medium text-zinc-900">Notifications</p>
        <p className="text-xs text-muted-foreground">
          {unreadCount > 0 
            ? `You have ${unreadCount} unread notifications` 
            : 'All caught up!'}
        </p>
      </div>
      <div className="flex gap-1.5">
        <Button
          onClick={onMarkAllAsRead}
          variant="default"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={!unreadCount || loading || isRefreshing}
        >
          Mark all read
        </Button>
        <Button
          onClick={onRefresh}
          variant="default"
          size="sm"
          className="h-7 w-7 p-0"
          disabled={loading || isRefreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
    </div>
  );
};
