
import React from 'react';
import { Header } from '@/components/layout/Header';
import { useNotificationsPage } from '@/hooks/notifications/useNotificationsPage';
import { NotificationsList } from '@/components/notifications/NotificationList';
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
    handleCompleteTask,
    handleRefresh,
  } = useNotificationsPage();

  // Log notifications for debugging
  console.log('Current notifications:', notifications);
  console.log('Loading state:', loading, 'Has attempted fetch:', hasAttemptedFetch);

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Notifications"
        // No secondary action buttons as per request
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
          <NotificationsList 
            notifications={notifications}
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
