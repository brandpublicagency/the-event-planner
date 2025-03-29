
import { useCallback } from 'react';
import { Notification } from '@/types/notification';

interface UseNotificationContentHandlersProps {
  onViewDetail: (notification: Notification, e: React.MouseEvent) => void;
  onCompleteTask: (notification: Notification, e: React.MouseEvent) => void;
}

export const useNotificationContentHandlers = ({
  onViewDetail,
  onCompleteTask
}: UseNotificationContentHandlersProps) => {
  
  const handleViewDetail = useCallback((notification: Notification, e: React.MouseEvent) => {
    console.log("useNotificationContentHandlers handleViewDetail called for:", notification.id);
    onViewDetail(notification, e);
  }, [onViewDetail]);

  const handleCompleteTask = useCallback((notification: Notification, e: React.MouseEvent) => {
    console.log("useNotificationContentHandlers handleCompleteTask called for:", notification.id);
    onCompleteTask(notification, e);
  }, [onCompleteTask]);

  return {
    handleViewDetail,
    handleCompleteTask
  };
};
