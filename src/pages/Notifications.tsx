
import React, { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { useNotificationsPage } from '@/hooks/notifications/useNotificationsPage';
import { NotificationsList } from '@/components/notifications/NotificationList';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Bell, CheckSquare, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

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
  const [activeTab, setActiveTab] = useState('all');

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

  // Filter notifications based on active tab
  const filteredNotifications = React.useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter(n => !n.read);
    }
    if (activeTab === 'tasks') {
      return notifications.filter(n => n.type.includes('task'));
    }
    if (activeTab === 'events') {
      return notifications.filter(n => n.type.includes('event'));
    }
    return notifications;
  }, [notifications, activeTab]);

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
              onClick={refreshWithState}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
              className="gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
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
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full md:w-auto grid md:inline-flex grid-cols-4 p-1">
                <TabsTrigger value="all" className="flex items-center gap-1.5">
                  <Bell className="h-4 w-4" />
                  <span>All</span>
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex items-center gap-1.5">
                  <span>Unread</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4" />
                  <span>Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Events</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4">
                {(loading || isRefreshing) && (
                  <div className="bg-white shadow rounded-lg text-center py-8 flex flex-col items-center">
                    <Spinner className="h-8 w-8 mb-2 text-primary" />
                    <p className="text-muted-foreground">Loading notifications...</p>
                  </div>
                )}
                
                {!loading && !isRefreshing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="all">
                      {filteredNotifications.length > 0 ? (
                        <NotificationsList 
                          notifications={filteredNotifications}
                          error={error}
                          onViewDetail={(id, relatedId) => handleViewEvent('unified', id, relatedId)}
                          onCompleteTask={(id) => handleCompleteTask('unified', id)}
                          listType="unified"
                        />
                      ) : (
                        <EmptyState refreshWithState={refreshWithState} activeTab={activeTab} />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="unread">
                      {filteredNotifications.length > 0 ? (
                        <NotificationsList 
                          notifications={filteredNotifications}
                          error={error}
                          onViewDetail={(id, relatedId) => handleViewEvent('unified', id, relatedId)}
                          onCompleteTask={(id) => handleCompleteTask('unified', id)}
                          listType="unread"
                        />
                      ) : (
                        <EmptyState refreshWithState={refreshWithState} activeTab={activeTab} />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="tasks">
                      {filteredNotifications.length > 0 ? (
                        <NotificationsList 
                          notifications={filteredNotifications}
                          error={error}
                          onViewDetail={(id, relatedId) => handleViewEvent('unified', id, relatedId)}
                          onCompleteTask={(id) => handleCompleteTask('unified', id)}
                          listType="tasks"
                        />
                      ) : (
                        <EmptyState refreshWithState={refreshWithState} activeTab={activeTab} />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="events">
                      {filteredNotifications.length > 0 ? (
                        <NotificationsList 
                          notifications={filteredNotifications}
                          error={error}
                          onViewDetail={(id, relatedId) => handleViewEvent('unified', id, relatedId)}
                          onCompleteTask={(id) => handleCompleteTask('unified', id)}
                          listType="events"
                        />
                      ) : (
                        <EmptyState refreshWithState={refreshWithState} activeTab={activeTab} />
                      )}
                    </TabsContent>
                  </motion.div>
                )}
              </div>
            </Tabs>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

// Empty state component to avoid repetition
const EmptyState = ({ refreshWithState, activeTab }) => {
  let message = "No notifications found";
  let icon = <Bell className="h-10 w-10 text-zinc-300 mb-3" />;
  
  if (activeTab === 'unread') {
    message = "No unread notifications";
    icon = <Bell className="h-10 w-10 text-zinc-300 mb-3" />;
  } else if (activeTab === 'tasks') {
    message = "No task notifications";
    icon = <CheckSquare className="h-10 w-10 text-zinc-300 mb-3" />;
  } else if (activeTab === 'events') {
    message = "No event notifications";
    icon = <Calendar className="h-10 w-10 text-zinc-300 mb-3" />;
  }
  
  return (
    <div className="bg-white shadow rounded-lg text-center py-12">
      {icon}
      <p className="text-muted-foreground mb-4">{message}</p>
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
