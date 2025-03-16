
import { Dispatch, SetStateAction, useCallback } from "react";
import { Notification } from "@/types/notification";

export function useNotificationActions(
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) {
  const markAsRead = useCallback((id: string): Promise<void> => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    return Promise.resolve();
  }, [setNotifications]);
  
  const markAllAsRead = useCallback((): void => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, [setNotifications]);
  
  const clearNotifications = useCallback((): void => {
    setNotifications([]);
  }, [setNotifications]);

  const markAsCompleted = useCallback((id: string): Promise<void> => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    return Promise.resolve();
  }, [setNotifications]);

  return {
    markAsRead,
    markAllAsRead,
    clearNotifications,
    markAsCompleted
  };
}
