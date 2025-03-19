
import React, { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { useNotificationsPage } from '@/hooks/notifications/useNotificationsPage';
import { NotificationsList } from '@/components/notifications/NotificationList';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

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
    handleRefresh
  } = useNotificationsPage();
  
  const { toast } = useToast();
  const initialLoadComplete = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<number | null>(null);
  const isInitialRender = useRef(true);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current !== null) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Controlled refresh function with debounce
  const refreshWithState = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await handleRefresh();
      toast({
        title: 'Success',
        description: 'Notifications refreshed successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh notifications',
        variant: 'destructive',
      });
    } finally {
      // Delay setting isRefreshing to false to prevent rapid clicks
      refreshTimeoutRef.current = window.setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  // Only do initial refresh if we've never loaded before and component is mounted
  useEffect(() => {
    // Skip initial refresh on first render to avoid race condition with navigation
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (!initialLoadComplete.current && !loading && !isRefreshing) {
      console.log('Notifications page mounted - performing initial refresh after delay');
      
      // Add a small delay to avoid conflicting with other operations
      refreshTimeoutRef.current = window.setTimeout(() => {
        initialLoadComplete.current = true;
        refreshWithState();
      }, 300);
    }
  }, [loading]);

  // Log notifications for debugging
  console.log('Notifications page rendering with notifications:', notifications.length);
  console.log('Loading state:', loading, 'Has attempted fetch:', hasAttemptedFetch);

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Notifications"
        secondaryAction={
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refreshWithState}
            disabled={isRefreshing || loading}
          >
            {isRefreshing || loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </>
            )}
          </Button>
        }
      />
      
      <div className="p-6 flex-1">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={refreshWithState}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Notification System Error</AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          )}
          
          {(loading || isRefreshing) && (
            <div className="text-center py-8 flex flex-col items-center">
              <Spinner className="h-8 w-8 mb-2" />
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          )}
          
          {!loading && !isRefreshing && notifications.length > 0 && (
            <NotificationsList 
              notifications={notifications}
              error={error}
              onViewDetail={(id, relatedId) => handleViewEvent('unified', id, relatedId)}
              onCompleteTask={(id) => handleCompleteTask('unified', id)}
              listType="unified"
            />
          )}
          
          {!loading && !isRefreshing && notifications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No notifications found</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={refreshWithState}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Notifications;
