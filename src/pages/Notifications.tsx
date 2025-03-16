
import React, { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useNotificationsPage } from '@/hooks/notifications/useNotificationsPage';
import { NotificationActions } from '@/components/notifications/NotificationActions';
import { NotificationList } from '@/components/notifications/NotificationList';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error loading notifications</AlertTitle>
    <AlertDescription className="flex flex-col gap-2">
      <div>There was a problem loading your notifications: {error.message}</div>
      <Button size="sm" onClick={resetErrorBoundary} className="self-start">
        <RefreshCw className="h-4 w-4 mr-1" />
        Try again
      </Button>
    </AlertDescription>
  </Alert>
);

const Notifications = () => {
  const {
    notifications,
    loading,
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess
  } = useNotificationsPage();

  // Log notifications for debugging
  console.log('Current notifications:', notifications);
  
  // Auto-trigger processing on initial load to ensure we have the latest notifications
  useEffect(() => {
    // Only trigger if there are no notifications
    if (notifications.length === 0 && !loading) {
      console.log('No notifications found, triggering processing...');
      handleTriggerProcess();
    }
  }, [notifications.length, loading, handleTriggerProcess]);

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Notifications"
        secondaryAction={
          <NotificationActions
            onRefresh={handleRefresh}
            onTriggerProcess={handleTriggerProcess}
            onMarkAllRead={handleMarkAllRead}
            loading={loading}
            showDevActions={process.env.NODE_ENV === 'development' || true} // Always show for now
          />
        }
      />
      
      <div className="p-6 flex-1">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleRefresh}>
          <NotificationList 
            notifications={notifications}
            loading={loading}
            onViewDetail={(id, relatedId) => handleViewEvent('unified', id, relatedId)}
            onCompleteTask={(id) => handleCompleteTask('unified', id)}
            listType="unified"
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Notifications;
