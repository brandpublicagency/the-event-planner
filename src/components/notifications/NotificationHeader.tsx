
import React from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

export const NotificationHeader = ({ onRefresh, loading }: NotificationHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bell className="h-6 w-6" />
        Notifications
      </h1>
      <Button
        onClick={onRefresh}
        disabled={loading}
        size="sm"
        variant="outline"
        className="gap-1.5"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};
