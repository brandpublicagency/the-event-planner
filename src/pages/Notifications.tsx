
import React from 'react';
import { Header } from '@/components/layout/Header';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationsList } from '@/components/notifications/NotificationList';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';
import { EmptyNotifications } from '@/components/notifications/EmptyNotifications';
import { useNotificationStore } from '@/store/notificationStore';

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
    markAsRead,
    markAsCompleted,
    refreshNotifications
  } = useNotifications();
  
  const { loading, error } = useNotificationStore();
  const { toast } = useToast();

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      await refreshNotifications();
      toast({
        title: 'Success',
        description: 'Notifications refreshed successfully',
      });
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh notifications',
        variant: 'destructive',
      });
    }
  };

  // Handle viewing a notification detail
  const handleViewDetail = async (id: string, relatedId?: string) => {
    try {
      await markAsRead(id);
      
      // Navigate based on notification type
      if (relatedId) {
        if (relatedId.startsWith('event_')) {
          window.location.href = `/events/${relatedId}`;
        } else {
          window.location.href = `/${relatedId}`;
        }
      }
      
      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Handle completing a task
  const handleCompleteTask = async (id: string) => {
    try {
      await markAsCompleted(id);
      toast({
        title: "Task marked as complete",
      });
    } catch (error) {
      console.error("Error marking task as complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark task as complete",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header pageTitle="Notifications" />
      
      <div className="container py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
            </h1>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              size="sm"
              variant="outline"
              className="gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleRefresh}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Notification System Error</AlertTitle>
                <AlertDescription>
                  {error.message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-4">
              {loading && (
                <div className="bg-white shadow rounded-lg text-center py-8 flex flex-col items-center">
                  <Spinner className="h-8 w-8 mb-2 text-primary" />
                  <p className="text-muted-foreground">Loading notifications...</p>
                </div>
              )}
              
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {notifications.length > 0 ? (
                    <NotificationsList 
                      notifications={notifications}
                      error={error}
                      onViewDetail={handleViewDetail}
                      onCompleteTask={handleCompleteTask}
                      listType="all"
                    />
                  ) : (
                    <EmptyState refreshWithState={handleRefresh} />
                  )}
                </motion.div>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

// Simplified empty state component
const EmptyState = ({ refreshWithState }) => {
  return (
    <div className="bg-white shadow rounded-lg text-center py-12">
      <Bell className="h-10 w-10 text-zinc-300 mb-3" />
      <p className="text-muted-foreground mb-4">No notifications found</p>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={refreshWithState}
        className="mx-auto"
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Refresh
      </Button>
    </div>
  );
};

export default Notifications;
