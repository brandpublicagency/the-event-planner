
import React from 'react';
import { RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
interface NotificationHeaderProps {
  unreadCount: number;
  loading: boolean;
  isRefreshing: boolean;
  onMarkAllAsRead: (e: React.MouseEvent) => void;
  onRefresh: (e: React.MouseEvent) => void;
}
export const NotificationHeader = ({
  unreadCount,
  loading,
  isRefreshing,
  onMarkAllAsRead,
  onRefresh
}: NotificationHeaderProps) => {
  return <div className="flex items-center justify-between p-3 py-4 rounded-lg bg-gray-200">
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-800">Notifications</p>
        <p className="text-xs text-muted-foreground">
          {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
        </p>
      </div>
      <div className="flex gap-1">
        <Button onClick={onMarkAllAsRead} variant="ghost" size="sm" disabled={!unreadCount || loading || isRefreshing} className="h-6 text-[10px] bg-white rounded-md px-1.5">
          <Check className="h-2.5 w-2.5 mr-1" />
          Mark all read
        </Button>
        <Button onClick={onRefresh} variant="ghost" size="sm" disabled={loading || isRefreshing} className="h-6 w-6 p-0 bg-white rounded-md">
          <RefreshCw className={`h-2.5 w-2.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
    </div>;
};
