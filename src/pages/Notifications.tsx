import React, { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useNotificationsPage } from '@/hooks/notifications/useNotificationsPage';
import { NotificationsList } from '@/components/notifications/NotificationList';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
    triggerNotificationProcessing
  } = useNotificationsPage();
  
  const { toast } = useToast();
  const location = useLocation();

  // Refresh notifications when the page is loaded
  useEffect(() => {
    console.log('Notifications page mounted - refreshing notifications');
    handleRefresh();
  }, [handleRefresh]);

  // Process and fetch missing notifications 
  const handleProcessNotifications = async () => {
    toast({
      title: "Processing notifications",
      description: "Checking for scheduled notifications...",
      variant: "default",
      showProgress: true,
    });
    
    try {
      await triggerNotificationProcessing();
      await handleRefresh();
      
      toast({
        title: "Notifications processed",
        description: "Latest notifications have been processed and loaded",
        variant: "success",
      });
    } catch (error) {
      console.error('Error processing notifications:', error);
      toast({
        title: "Processing failed",
        description: "There was an error processing notifications. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Log notifications for debugging
  console.log('Notifications page rendering with notifications:', notifications.length);
  console.log('Loading state:', loading, 'Has attempted fetch:', hasAttemptedFetch);

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Notifications"
        // No secondary action buttons as per request
      />
      
      <div className="p-6 flex-1">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleRefresh}>
          <div className="flex justify-between items-center mb-4">
            <div></div> {/* Empty div to maintain flex layout */}
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleProcessNotifications}
                disabled={loading}
              >
                <Zap className="h-4 w-4 mr-1" />
                Process All
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Notification System Error</AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          )}
          
          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
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
