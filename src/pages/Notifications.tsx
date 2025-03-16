
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
    error,
    hasAttemptedFetch,
    handleViewEvent,
    handleMarkAllRead,
    handleCompleteTask,
    handleRefresh,
    handleTriggerProcess,
    handleManualNotificationCheck
  } = useNotificationsPage();

  // Log notifications for debugging
  console.log('Current notifications:', notifications);
  console.log('Loading state:', loading, 'Has attempted fetch:', hasAttemptedFetch);
  
  // Only trigger processing once when there are no notifications, no errors, and we've completed a fetch
  useEffect(() => {
    // Only trigger if there are no notifications, we're not already loading, we have attempted a fetch, and there's no error
    if (notifications.length === 0 && !loading && hasAttemptedFetch && !error) {
      console.log('No notifications found after fetching, triggering processing once...');
      // Using a more controlled approach with a flag to prevent multiple triggers
      handleTriggerProcess().catch(err => {
        console.error('Error triggering notification process:', err);
      });
    }
  }, [hasAttemptedFetch, notifications.length, loading, error, handleTriggerProcess]);

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Notifications"
        secondaryAction={
          <NotificationActions
            onRefresh={handleRefresh}
            onTriggerProcess={handleTriggerProcess}
            onMarkAllRead={handleMarkAllRead}
            onCheckMissing={handleManualNotificationCheck}
            loading={loading}
            showDevActions={true} // Always show these actions for now since we need them
          />
        }
      />
      
      <div className="p-6 flex-1">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleRefresh}>
          {error && (
            <Alert variant="default" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Edge Function Unavailable</AlertTitle>
              <AlertDescription>
                Using local notification data. Some features may be limited.
              </AlertDescription>
            </Alert>
          )}
          <NotificationList 
            notifications={notifications}
            loading={loading}
            error={error}
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
