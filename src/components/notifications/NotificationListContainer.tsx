
import React, { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { NotificationErrorFallback } from './NotificationErrorFallback';
import { NotificationsList } from './NotificationList';
import { Notification } from '@/types/notification';
import { groupNotificationsByDate } from '@/utils/groupNotificationsByDate';

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
  const groups = useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications]
  );

  return (
    <ErrorBoundary 
      FallbackComponent={NotificationErrorFallback} 
      onReset={() => onRefresh} 
    >
      <div className="mt-4 space-y-6">
        {notifications.length === 0 && !error ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No notifications to display
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {group.label}
              </h3>
              <NotificationsList
                notifications={group.notifications}
                onViewDetail={onViewDetail}
                onCompleteTask={onCompleteTask}
                error={error}
                listType="all"
              />
            </div>
          ))
        )}
      </div>
    </ErrorBoundary>
  );
};
