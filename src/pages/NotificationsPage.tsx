
import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationsList } from '@/components/notifications/NotificationList';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle } from 'lucide-react';

export function NotificationsPage() {
  const { 
    notifications, 
    markAsRead, 
    markAsCompleted, 
    markAllAsRead, 
    refreshNotifications 
  } = useNotifications();

  const handleViewEvent = async (id: string, relatedId?: string) => {
    await markAsRead(id);
  };

  const handleCompleteTask = async (id: string) => {
    await markAsCompleted(id);
  };

  const handleRefresh = async () => {
    await refreshNotifications();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notifications and alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-md shadow">
          <NotificationsList 
            notifications={notifications}
            onViewDetail={handleViewEvent}
            onCompleteTask={handleCompleteTask}
          />
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
