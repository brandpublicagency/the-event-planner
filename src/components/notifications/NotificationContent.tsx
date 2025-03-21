
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Notification } from '@/types/notification';
import { NotificationsList } from '@/components/notifications/NotificationList';
import { EmptyState } from '@/components/notifications/EmptyState';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface NotificationContentProps {
  notifications: Notification[];
  loading: boolean;
  error: Error | null;
  onViewDetail: (id: string, relatedId?: string) => void;
  onCompleteTask: (id: string) => void;
  onRefresh: () => void;
}

export const NotificationContent = ({
  notifications,
  loading,
  error,
  onViewDetail,
  onCompleteTask,
  onRefresh
}: NotificationContentProps) => {
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [showFallbackLoader, setShowFallbackLoader] = useState(false);
  
  // Only show the initial loader for a limited time
  useEffect(() => {
    const initialLoaderTimeout = setTimeout(() => {
      setShowInitialLoader(false);
    }, 2000); // Show loader for max 2 seconds
    
    // If loading takes too long, show a fallback message
    const fallbackTimeout = setTimeout(() => {
      if (loading && notifications.length === 0) {
        setShowFallbackLoader(true);
      }
    }, 5000); // After 5 seconds, if still loading
    
    return () => {
      clearTimeout(initialLoaderTimeout);
      clearTimeout(fallbackTimeout);
    };
  }, [loading, notifications.length]);
  
  // If loading for first time (no notifications yet), show loading state
  if (loading && notifications.length === 0 && showInitialLoader) {
    return (
      <div className="bg-white shadow rounded-lg text-center py-8 flex flex-col items-center">
        <Spinner className="h-6 w-6 mb-2 text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
      </div>
    );
  }
  
  // Show fallback message if loading takes too long
  if (showFallbackLoader && notifications.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg text-center py-8 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-2">
          Taking longer than expected to load notifications...
        </p>
        <button 
          onClick={onRefresh} 
          className="text-sm text-primary hover:underline mt-2"
        >
          Try refreshing
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Notification System Error</AlertTitle>
        <AlertDescription>
          {error.message}
          <div className="mt-2">
            <button 
              onClick={onRefresh}
              className="text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {notifications.length > 0 ? (
        <NotificationsList 
          notifications={notifications}
          error={error}
          onViewDetail={onViewDetail}
          onCompleteTask={onCompleteTask}
          listType="all"
        />
      ) : (
        <EmptyState refreshWithState={onRefresh} />
      )}
      
      {/* Show a subtle loading indicator when refreshing with existing content */}
      {loading && notifications.length > 0 && (
        <div className="flex justify-center mt-2">
          <Spinner className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
};
