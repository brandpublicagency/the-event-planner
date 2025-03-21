
import React from 'react';
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
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg text-center py-4 flex flex-col items-center">
        <Spinner className="h-4 w-4 mb-2 text-primary" />
        <p className="text-sm text-muted-foreground">Loading notifications...</p>
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
    </motion.div>
  );
};
