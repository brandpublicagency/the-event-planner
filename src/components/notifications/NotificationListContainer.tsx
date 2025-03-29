
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { NotificationErrorFallback } from './NotificationErrorFallback';
import { NotificationsList } from './NotificationList';
import { Notification } from '@/types/notification';

interface NotificationListContainerProps {
  notifications: Notification[];
  onViewDetail: (notification: Notification, e: React.MouseEvent) => void;
  onCompleteTask: (notification: Notification, e: React.MouseEvent) => void;
  onRefresh: (e: React.MouseEvent) => void;
  error: Error | null;
}

export const NotificationListContainer = ({
  notifications,
  onViewDetail,
  onCompleteTask,
  onRefresh,
  error
}: NotificationListContainerProps) => {
  return (
    <ErrorBoundary 
      FallbackComponent={NotificationErrorFallback} 
      onReset={() => onRefresh} 
    >
      <div className="mt-4">
        <NotificationsList 
          notifications={notifications}
          onViewDetail={onViewDetail}
          onCompleteTask={onCompleteTask}
          error={error}
          listType="all"
        />
      </div>
    </ErrorBoundary>
  );
};
