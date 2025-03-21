
import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
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
      <PageHeader 
        title="Notifications" 
        description="Manage your notifications and alerts"
      >
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
      </PageHeader>

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
